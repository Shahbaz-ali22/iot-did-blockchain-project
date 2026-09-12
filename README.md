# 🔐 Blockchain-Based Decentralized Identity for Secure IoT Device Onboarding

> A web-based security prototype exploring decentralized identity, device authorization, revocation, and auditability for IoT environments.

[![React](https://img.shields.io/badge/React-TypeScript-61DAFB?logo=react&logoColor=black)](https://react.dev/) [![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)](https://vite.dev/) [![Status](https://img.shields.io/badge/Status-Educational%20Prototype-orange)](https://github.com/Shahbaz-ali22/iot-did-blockchain-project)

## 🎯 Why this project?

IoT deployments need trustworthy device identity and access control. This project demonstrates a blockchain-inspired workflow in which each device receives a unique hash-based identity, is verified before access, and can be revoked when compromised.

## ✨ Features

- Device registration and identity generation
- Hash-based DID-style identity simulation
- Device authorization and revocation
- Simulated tamper-resistant ledger
- Audit logs and network monitoring
- Admin dashboard
- Device emulator for testing

## 🧠 Security Concepts

**Identity & Access Management • Authentication • Authorization • Revocation • Auditability • IoT Security • Blockchain Concepts**

## 🔄 Workflow

```text
Device Registration → Identity Generation → Ledger Storage
        ↓                    ↓                    ↓
   Verification ← Authorization Check ← Audit Logging
        ↓
  Network Access / Revocation
```

## 🛠️ Tech Stack

- React + TypeScript
- Vite
- HTML / CSS
- Hashing & blockchain concepts

## 🌐 Demo

**Live demo:** https://did-iot-simulator.netlify.app/

## ▶️ Run Locally

```bash
git clone https://github.com/Shahbaz-ali22/iot-did-blockchain-project.git
cd iot-did-blockchain-project
npm install
npm run dev
```

## 📸 Preview

![Dashboard](https://github.com/Shahbaz-ali22/iot-did-blockchain-project/blob/main/Screenshot%202026-03-25%20125027.png)

## 🚧 Limitations

This is an educational prototype. The ledger is simulated and is not a production blockchain or standards-compliant DID implementation.

## 🔭 Future Improvements

- Integrate Ethereum or Hyperledger
- Add standards-compliant DIDs and verifiable credentials
- Add device attestation
- Add automated security testing
- Strengthen RBAC and authentication

## 👥 Team

Shahbaz Ali • Harshit • Himanshu • Kartik Yadav

## 📄 License

See the repository license for usage terms.
