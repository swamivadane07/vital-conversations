# Medical App EKS Deployment

This directory contains all the Kubernetes manifests and scripts needed to deploy the Medical App to Amazon EKS.

## Directory Structure

```
k8s/
├── cluster-setup.sh     # EKS cluster creation script
├── deploy.sh           # Application deployment script
├── namespace.yaml      # Frontend and Backend namespaces
├── configmap.yaml      # Configuration and secrets
├── deployment.yaml     # Frontend deployment
├── service.yaml        # Frontend service
├── ingress.yaml        # ALB ingress configuration
├── hpa.yaml           # Horizontal Pod Autoscaler
├── monitoring.yaml     # Optional monitoring setup
└── README.md          # This file
```

## Prerequisites

1. **AWS CLI** configured with appropriate permissions
2. **eksctl** - EKS cluster management tool
3. **kubectl** - Kubernetes command-line tool
4. **Docker** - For building container images
5. **Helm** - For installing charts

## Quick Start

### 1. Create EKS Cluster

```bash
# Make scripts executable
chmod +x k8s/cluster-setup.sh k8s/deploy.sh

# Create the EKS cluster (takes ~15-20 minutes)
./k8s/cluster-setup.sh
```

### 2. Configure Supabase Production

1. Create a new Supabase project for production
2. Update `k8s/configmap.yaml` with your production Supabase credentials:
   - Replace `SUPABASE_URL`
   - Replace secret keys in the Secret resources

### 3. Configure Domain (Optional)

Update `k8s/ingress.yaml`:
- Replace `your-domain.com` with your actual domain
- Uncomment and update the certificate ARN if using SSL

### 4. Deploy Application

```bash
# Update ECR repository URL in deploy.sh (printed by cluster-setup.sh)
vim deploy.sh

# Deploy the application
./deploy.sh
```

## Architecture

### Namespaces

- **medical-app-frontend**: Contains the React frontend application
- **medical-app-backend**: Reserved for future backend services (if needed)

### Components

1. **Frontend Deployment**: 3 replicas of the React app
2. **Service**: ClusterIP service for internal communication
3. **Ingress**: ALB for external traffic routing
4. **HPA**: Auto-scaling based on CPU/memory usage
5. **ConfigMap/Secrets**: Environment variables and secrets

### Resource Limits

- **CPU**: 100m request, 200m limit
- **Memory**: 128Mi request, 256Mi limit
- **Replicas**: 2-10 with auto-scaling

## Monitoring (Optional)

Install Prometheus and Grafana:

```bash
# Install monitoring stack
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install monitoring prometheus-community/kube-prometheus-stack -n monitoring --create-namespace

# Apply custom monitoring rules
kubectl apply -f k8s/monitoring.yaml
```

## SSL Certificate

To enable HTTPS:

1. Request a certificate via AWS Certificate Manager:
```bash
aws acm request-certificate \
  --domain-name yourdomain.com \
  --validation-method DNS \
  --region us-west-2
```

2. Update `k8s/ingress.yaml` with the certificate ARN

## Troubleshooting

### Common Issues

1. **ALB not created**: Check AWS Load Balancer Controller installation
2. **Pods not starting**: Check resource limits and node capacity
3. **502 errors**: Verify service and ingress configuration

### Useful Commands

```bash
# Check cluster status
kubectl get nodes

# Check application status
kubectl get all -n medical-app-frontend

# View logs
kubectl logs -f deployment/medical-app-frontend -n medical-app-frontend

# Describe ingress
kubectl describe ingress medical-app-ingress -n medical-app-frontend

# Scale manually
kubectl scale deployment medical-app-frontend --replicas=5 -n medical-app-frontend
```

## Security Considerations

1. **Secrets Management**: Use Kubernetes secrets for sensitive data
2. **Network Policies**: Consider implementing network policies for isolation
3. **RBAC**: Set up proper role-based access control
4. **Pod Security Standards**: Enable pod security standards

## Cost Optimization

1. **Node Types**: Use appropriate instance types for your workload
2. **Spot Instances**: Consider using spot instances for cost savings
3. **Cluster Autoscaler**: Install cluster autoscaler for node optimization
4. **Resource Requests**: Set appropriate resource requests and limits

## Cleanup

To delete the entire infrastructure:

```bash
# Delete the EKS cluster
eksctl delete cluster --name medical-app-cluster --region us-west-2

# Delete ECR repository
aws ecr delete-repository --repository-name medical-app --force --region us-west-2
```