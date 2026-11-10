# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-dae16db50b4d · draft · source: deployment:dae16db50b4d

Version dae16db50b4d of the Personal Notes app is deployed and live. The release has two parts: a frontend hosted on AWS Amplify and a backend reachable through an sslip.io hostname.

- Status: live
- Version: dae16db50b4d
- Frontend URL: https://p6d4f86f9a0c7.d3j61xaup4zgrx.amplifyapp.com
- Backend URL: https://52-24-58-20.sslip.io/apps/6d4f86f9a0c7/
- Not stated in the input:
  - deployment date or time
  - who deployed or approved the release
  - environment name (e.g. staging or production)
  - release notes or changelog
  - smoke tests or health checks
  - rollback procedure
  - which requirements (US-001 to US-015) this release covers

**Related:** DEP-dae16db50b4d-FE, DEP-dae16db50b4d-BE

### DEP-dae16db50b4d-FE · draft · source: deployment:dae16db50b4d

Frontend endpoint for release dae16db50b4d. It is hosted on an AWS Amplify app domain and is where users reach the Login, Notes list, and Note editor screens.

- URL: https://p6d4f86f9a0c7.d3j61xaup4zgrx.amplifyapp.com
- Hosting: AWS Amplify (inferred only from the amplifyapp.com domain)
- Release status: live
- Not stated in the input: custom domain, CDN or cache settings, build configuration

**Related:** DEP-dae16db50b4d

### DEP-dae16db50b4d-BE · draft · source: deployment:dae16db50b4d

Backend endpoint for release dae16db50b4d. It is served over HTTPS from an sslip.io hostname that maps to IP 52.24.58.20, under an app-specific path.

- URL: https://52-24-58-20.sslip.io/apps/6d4f86f9a0c7/
- Host: sslip.io wildcard DNS resolving to 52.24.58.20
- App path segment: 6d4f86f9a0c7 (matches the identifier in the frontend subdomain p6d4f86f9a0c7)
- Release status: live
- Not stated in the input: runtime or platform, database, authentication service configuration, scaling, monitoring
- Observation for human review: the backend uses an IP-derived sslip.io hostname, not a dedicated domain. The input does not say whether this is intended for long-term use.

**Related:** DEP-dae16db50b4d
<!-- sdlc:auto:end narrative -->
