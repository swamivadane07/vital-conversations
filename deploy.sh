#!/bin/bash

# Medical App EKS Deployment Script
set -e

echo "🏥 Starting Medical App EKS deployment..."

# Variables - Update these with your values
AWS_REGION="us-west-2"
ECR_REPO="your-account-id.dkr.ecr.us-west-2.amazonaws.com/medical-app"
EKS_CLUSTER_NAME="medical-app-cluster"
IMAGE_TAG="latest"

# Check if required tools are installed
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed."; exit 1; }
command -v kubectl >/dev/null 2>&1 || { echo "❌ kubectl is required but not installed."; exit 1; }
command -v aws >/dev/null 2>&1 || { echo "❌ AWS CLI is required but not installed."; exit 1; }

echo "✅ Prerequisites check passed"

# Login to ECR
echo "🔐 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO

# Build and tag the Docker image
echo "🏗️ Building Docker image..."
docker build -t medical-app:$IMAGE_TAG .
docker tag medical-app:$IMAGE_TAG $ECR_REPO:$IMAGE_TAG

# Push to ECR
echo "📤 Pushing to ECR..."
docker push $ECR_REPO:$IMAGE_TAG

# Update kubeconfig
echo "⚙️ Updating kubeconfig for EKS cluster..."
aws eks update-kubeconfig --region $AWS_REGION --name $EKS_CLUSTER_NAME

# Update deployment image
echo "📝 Updating deployment image in k8s/deployment.yaml..."
sed -i.bak "s|your-ecr-repo/medical-app:latest|$ECR_REPO:$IMAGE_TAG|g" k8s/deployment.yaml

# Apply Kubernetes manifests
echo "🚀 Deploying to EKS..."
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/ingress.yaml

# Wait for deployment to be ready
echo "⏳ Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/medical-app-frontend -n medical-app

# Get deployment status
echo "📊 Deployment Status:"
kubectl get pods -n medical-app
kubectl get services -n medical-app
kubectl get ingress -n medical-app

echo "✅ Medical App deployed successfully to EKS!"
echo "🌐 Your app will be available at the ALB endpoint shown above"