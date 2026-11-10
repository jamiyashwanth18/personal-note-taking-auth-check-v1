<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-11-10

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v1.

## Considered Options

- AWS
- Azure
- GCP

## Decision Outcome

Chosen option: AWS, because Approved stack. S3 and CloudFront host the SPA, App Runner hosts the API container, and RDS hosts PostgreSQL 16. All are managed and right-sized for hundreds of users.

## Consequences

Three managed services carry some baseline cost even at low traffic. App Runner keeps the operations burden low compared with ECS.
<!-- sdlc:auto:end adr -->