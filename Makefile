# Medical App Docker Deployment Makefile

# Variables
AWS_REGION ?= us-west-2
AWS_ACCOUNT_ID ?= $(shell aws sts get-caller-identity --query Account --output text)
ECR_REPO ?= $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/medical-app
IMAGE_TAG ?= latest
CLUSTER_NAME ?= medical-app-cluster

# Colors for output
RED = \033[0;31m
GREEN = \033[0;32m
YELLOW = \033[0;33m
BLUE = \033[0;34m
NC = \033[0m # No Color

.PHONY: help build push deploy clean setup-cluster install-tools

help: ## Show this help message
	@echo "$(BLUE)Medical App Docker Deployment$(NC)"
	@echo ""
	@echo "$(YELLOW)Available commands:$(NC)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install-tools: ## Install required tools (requires root/sudo)
	@echo "$(YELLOW)Installing required tools...$(NC)"
	@command -v docker >/dev/null 2>&1 || (echo "$(RED)Please install Docker$(NC)" && exit 1)
	@command -v aws >/dev/null 2>&1 || (echo "$(RED)Please install AWS CLI$(NC)" && exit 1)
	@command -v kubectl >/dev/null 2>&1 || (echo "$(RED)Please install kubectl$(NC)" && exit 1)
	@echo "$(GREEN)All tools are installed!$(NC)"

setup-cluster: ## Create EKS cluster and ECR repository
	@echo "$(YELLOW)Setting up EKS cluster...$(NC)"
	@echo "$(BLUE)This will take about 15-20 minutes$(NC)"
	eksctl create cluster \
		--name $(CLUSTER_NAME) \
		--region $(AWS_REGION) \
		--nodegroup-name standard-workers \
		--node-type t3.medium \
		--nodes 3 \
		--nodes-min 2 \
		--nodes-max 4 \
		--managed
	@echo "$(YELLOW)Creating ECR repository...$(NC)"
	aws ecr create-repository --repository-name medical-app --region $(AWS_REGION) || true
	@echo "$(GREEN)Cluster setup complete!$(NC)"
	@echo "$(BLUE)ECR Repository: $(ECR_REPO)$(NC)"

login: ## Login to ECR
	@echo "$(YELLOW)Logging into ECR...$(NC)"
	aws ecr get-login-password --region $(AWS_REGION) | docker login --username AWS --password-stdin $(ECR_REPO)
	@echo "$(GREEN)ECR login successful!$(NC)"

build: ## Build Docker image
	@echo "$(YELLOW)Building Docker image...$(NC)"
	docker build -f Dockerfile.prod -t medical-app:$(IMAGE_TAG) .
	docker tag medical-app:$(IMAGE_TAG) $(ECR_REPO):$(IMAGE_TAG)
	@echo "$(GREEN)Image built: $(ECR_REPO):$(IMAGE_TAG)$(NC)"

push: login build ## Build and push Docker image to ECR
	@echo "$(YELLOW)Pushing image to ECR...$(NC)"
	docker push $(ECR_REPO):$(IMAGE_TAG)
	@echo "$(GREEN)Image pushed successfully!$(NC)"

apply-k8s: ## Apply Kubernetes manifests
	@echo "$(YELLOW)Applying Kubernetes manifests...$(NC)"
	aws eks update-kubeconfig --region $(AWS_REGION) --name $(CLUSTER_NAME)
	kubectl apply -f k8s/namespace.yaml
	kubectl apply -f k8s/configmap.yaml
	kubectl apply -f k8s/deployment.yaml
	kubectl apply -f k8s/service.yaml
	kubectl apply -f k8s/hpa.yaml
	kubectl apply -f k8s/ingress.yaml
	@echo "$(GREEN)Kubernetes manifests applied!$(NC)"

wait-ready: ## Wait for deployment to be ready
	@echo "$(YELLOW)Waiting for deployment to be ready...$(NC)"
	kubectl wait --for=condition=available --timeout=300s deployment/medical-app-frontend -n medical-app-frontend
	@echo "$(GREEN)Deployment is ready!$(NC)"

status: ## Show deployment status
	@echo "$(BLUE)Deployment Status:$(NC)"
	kubectl get pods -n medical-app-frontend
	kubectl get services -n medical-app-frontend
	kubectl get ingress -n medical-app-frontend

deploy: push apply-k8s wait-ready status ## Complete deployment (build, push, deploy, wait, status)
	@echo "$(GREEN)🎉 Medical App deployed successfully!$(NC)"
	@echo "$(BLUE)Your app will be available at the ALB endpoint shown above$(NC)"

local-run: ## Run locally with Docker Compose
	@echo "$(YELLOW)Running locally with Docker Compose...$(NC)"
	docker-compose up --build

local-stop: ## Stop local Docker Compose
	@echo "$(YELLOW)Stopping local containers...$(NC)"
	docker-compose down

clean: ## Clean up local Docker images
	@echo "$(YELLOW)Cleaning up Docker images...$(NC)"
	docker rmi medical-app:$(IMAGE_TAG) || true
	docker rmi $(ECR_REPO):$(IMAGE_TAG) || true
	docker system prune -f

destroy-cluster: ## Destroy EKS cluster (WARNING: This will delete everything)
	@echo "$(RED)WARNING: This will destroy the entire EKS cluster!$(NC)"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ]
	eksctl delete cluster --name $(CLUSTER_NAME) --region $(AWS_REGION)
	aws ecr delete-repository --repository-name medical-app --force --region $(AWS_REGION) || true
	@echo "$(GREEN)Cluster destroyed$(NC)"

logs: ## Show application logs
	kubectl logs -f deployment/medical-app-frontend -n medical-app-frontend

scale: ## Scale deployment (usage: make scale REPLICAS=5)
	kubectl scale deployment medical-app-frontend --replicas=$(REPLICAS) -n medical-app-frontend

rollback: ## Rollback to previous deployment
	kubectl rollout undo deployment/medical-app-frontend -n medical-app-frontend

# Development targets
dev-build: ## Build for development
	docker-compose build

dev-up: ## Start development environment
	docker-compose up -d

dev-down: ## Stop development environment
	docker-compose down

dev-logs: ## Show development logs
	docker-compose logs -f