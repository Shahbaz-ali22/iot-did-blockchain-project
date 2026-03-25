# 🔐 IoT DID Blockchain Project

> Secure IoT Device Onboarding using Blockchain Concepts

---

## 📌 Overview
The rapid growth of IoT devices has introduced serious security challenges, especially during the onboarding and authentication phase. Traditional systems rely on centralized registries, default credentials, or shared keys, making them highly vulnerable to attacks such as unauthorized access, device impersonation, and data tampering.

This project presents a **web-based prototype** that demonstrates a **blockchain-inspired decentralized identity (DID) system** for secure IoT device onboarding. Instead of relying on a central authority, each device is assigned a **unique cryptographic identity (hash)**, ensuring that its identity cannot be altered or forged.

The system simulates a **blockchain ledger**, where device identities and their authorization status are stored in a tamper-resistant structure. During the onboarding process, every device must be verified against this ledger before being allowed to interact with the network.

Additionally, the system provides:
- **Device revocation**, allowing compromised devices to be removed instantly  
- **Audit logs**, ensuring transparency and traceability of all actions  
- **Admin dashboard**, for monitoring and controlling the network  

Although this implementation is a **prototype**, it effectively demonstrates how blockchain principles can be applied to enhance IoT security. The system can be extended to integrate real blockchain platforms such as Ethereum or Hyperledger for production-level deployment.

---

## 🎯 Problem Statement
Traditional IoT systems suffer from:
- Weak authentication mechanisms
- Use of default/shared credentials
- Centralized registries (easy to hack)

---

## 💡 Solution
We developed a **Blockchain-based Identity System** where:
- Each device gets a **unique identity (hash)**
- Devices are **verified before access**
- Unauthorized devices are blocked
- All actions are recorded for transparency

---

## ⚙️ Features
- 🔹 Device Registration System  
- 🔹 Blockchain-based Identity (Hashing)  
- 🔹 Admin Dashboard  
- 🔹 Audit Logs (Tracking activity)  
- 🔹 Device Revocation  
- 🔹 Network Monitoring  

---

## 🧠 How It Works
1. Device is registered with a unique name  
2. System generates a **hash-based identity**  
3. Identity is stored in a simulated blockchain ledger  
4. Gateway verifies device before allowing access  
5. All actions are logged in audit trail  

---

## 🛠️ Tech Stack
- ⚛️ React + TypeScript  
- ⚡ Vite  
- 🎨 HTML, CSS  
- 🔐 Hashing (Blockchain Simulation)  

---

## 👨‍💻 Team Members

- **Shahbaz Ali** (Team Leader)  
- **Harshit**  
- **Himanshu**  
- **Kartik Yadav**

---

## ▶️ Run Locally

```bash
npm install
npm run dev