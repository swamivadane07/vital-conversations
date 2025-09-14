# Medical App EKS Deployment

This directory contains all the Kubernetes manifests and Docker-based deployment files for the Medical App on Amazon EKS.

## Directory Structure

```
k8s/
├── namespace.yaml      # Frontend and Backend namespaces
├── configmap.yaml      # Configuration and secrets
├── deployment.yaml     # Frontend deployment
├── service.yaml        # Frontend service
├── ingress.yaml        # ALB ingress configuration
├── hpa.yaml           # Horizontal Pod Autoscaler
├── monitoring.yaml     # Optional monitoring setup
└── README.md          # This file

Root directory:
├── Dockerfile.prod     # Production Dockerfile
├── docker-compose.yml  # Local development
├── docker-compose.prod.yml # Production compose
├── docker-deploy.json  # Deployment configuration
├── Makefile           # Docker deployment automation
└── .dockerignore      # Docker ignore file
```

## Prerequisites

1. **Docker** - Container runtime
2. **AWS CLI** - Configured with appropriate permissions
3. **kubectl** - Kubernetes command-line tool
4. **eksctl** - EKS cluster management tool (optional)
5. **Make** - For using the Makefile

## Quick Start with Docker

### 1. Local Development

```bash
# Run locally
make local-run

# Stop local environment
make local-stop
```

### 2. Production Deployment

```bash
# Install tools and setup cluster
make install-tools
make setup-cluster

# Deploy to EKS
make deploy

# Check status
make status
```

### 3. Using Make Commands

```bash
# See all available commands
make help

# Build and push image
make push

# Deploy to Kubernetes
make apply-k8s

# Complete deployment pipeline
make deploy
```

## Docker-Based Deployment

### Local Development

Use `docker-compose.yml` for local development:

```bash
docker-compose up --build
```

### Production

Use `Dockerfile.prod` for production builds:

```bash
# Build production image
docker build -f Dockerfile.prod -t medical-app:latest .

# Run with production compose
ECR_REPO=your-repo docker-compose -f docker-compose.prod.yml up
```

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make setup-cluster` | Create EKS cluster and ECR repo |
| `make build` | Build Docker image |
| `make push` | Build and push to ECR |
| `make deploy` | Complete deployment pipeline |
| `make status` | Show deployment status |
| `make logs` | Show application logs |
| `make scale REPLICAS=5` | Scale deployment |
| `make clean` | Clean up local images |

## Configuration

### Environment Variables

Set these in your environment or `.env` file:

```bash
AWS_REGION=us-west-2
AWS_ACCOUNT_ID=123456789012
ECR_REPO=123456789012.dkr.ecr.us-west-2.amazonaws.com/medical-app
IMAGE_TAG=latest
CLUSTER_NAME=medical-app-cluster
```

### Supabase Configuration

Update `k8s/configmap.yaml` with your production Supabase credentials:

```yaml
data:
  SUPABASE_URL: "https://your-project.supabase.co"
```

## Docker Multi-Stage Build

The `Dockerfile.prod` uses a multi-stage build:

1. **Build Stage**: Compiles the React application
2. **Production Stage**: Runs with Nginx, includes security hardening

### Security Features

- Non-root user execution
- Minimal attack surface with Alpine Linux
- Health checks included
- Resource limits enforced

## Monitoring

### Application Logs

```bash
# Real-time logs
make logs

# Or with kubectl
kubectl logs -f deployment/medical-app-frontend -n medical-app-frontend
```

### Health Checks

The Docker image includes health checks:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' container_id
```

## Troubleshooting

### Common Docker Issues

1. **Build failures**: Check .dockerignore and build context
2. **Permission issues**: Ensure Docker daemon is running
3. **Push failures**: Verify AWS credentials and ECR login

### Kubernetes Issues

1. **Image pull errors**: Check ECR permissions and image tags
2. **Pod crashes**: Check resource limits and health checks
3. **Service unavailable**: Verify service and ingress configuration

### Useful Commands

```bash
# Debug container
docker run -it --entrypoint /bin/sh medical-app:latest

# Check image layers
docker history medical-app:latest

# Container resource usage
docker stats

# Kubernetes debugging
kubectl describe pod <pod-name> -n medical-app-frontend
kubectl exec -it <pod-name> -n medical-app-frontend -- /bin/sh
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to EKS
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        run: |
          make setup-aws-credentials
          make deploy
```

### Docker Registry

The setup uses Amazon ECR, but you can adapt for other registries:

```bash
# For Docker Hub
docker tag medical-app:latest username/medical-app:latest
docker push username/medical-app:latest
```

## Cost Optimization

1. **Multi-stage builds**: Reduces final image size
2. **Resource limits**: Prevents resource waste
3. **Auto-scaling**: HPA scales based on usage
4. **Spot instances**: Use spot instances for cost savings

## Cleanup

```bash
# Clean local Docker resources
make clean

# Destroy entire EKS cluster (careful!)
make destroy-cluster
```