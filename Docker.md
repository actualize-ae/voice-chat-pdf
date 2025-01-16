### `Docker.md` - Instructions to Running the Application with Docker and Docker Compose

This document explains how to run the application using the `Dockerfile`, manage secrets independently, and use `docker-compose.yml` for local development. The application will be accessible on **port 3000**.

---

## Prerequisites

- Install **Docker** and **Docker Compose** on your system.
- Ensure you have the necessary secrets and `.env` file with the correct values.

---

## Running with Dockerfile

### 1. Build the Docker Image
Run the following command to build the Docker image but ensure the Dockerfile exists in the path where you run the command below:
```bash
docker build --no-cache -t  my-nextjs-app .
```

### 2. Create the `secrets/` Directory
Create the `secrets/` directory in the project root:
```bash
mkdir -p secrets
```

### 3. Add Secret Files
Create the following files under the `secrets/` directory and replace the placeholder values with the actual ones:

```bash
echo "<qdrant_host>.cloud.qdrant.io" > secrets/QDRANT_URL
echo "<qdrant_api_key>" > secrets/QDRANT_API_KEY
echo "postgresql://postgres.qxyxszjvfffbvrmsdcxt:#@@dfyttyy55464As@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" > secrets/next_public_supabase_url
echo "<supabase_anon_key>" > secrets/next_public_supabase_anon_key
echo "<supabase_bucket_name>" > secrets/next_public_supabase_bucket_name
echo "1MB" > secrets/next_public_supabase_bucket_file_size_limit
echo "null" > secrets/next_public_supabase_bucket_allowed_mime_types
echo "<supabase_table_name>" > secrets/next_public_supabase_user_table_name
```

### 4. Run the Docker Container
Run the container while mounting the secrets:
```bash
docker run -p 3000:3000 \
    --mount type=bind,source="$(pwd)/secrets/QDRANT_URL",target="/run/secrets/QDRANT_URL",readonly \
    --mount type=bind,source="$(pwd)/secrets/QDRANT_API_KEY",target="/run/secrets/QDRANT_API_KEY",readonly \
    --mount type=bind,source="$(pwd)/secrets/next_public_supabase_url",target="/run/secrets/next_public_supabase_url",readonly \
    --mount type=bind,source="$(pwd)/secrets/next_public_supabase_anon_key",target="/run/secrets/next_public_supabase_anon_key",readonly \
    --mount type=bind,source="$(pwd)/secrets/next_public_supabase_bucket_name",target="/run/secrets/next_public_supabase_bucket_name",readonly \
    --mount type=bind,source="$(pwd)/secrets/next_public_supabase_bucket_file_size_limit",target="/run/secrets/next_public_supabase_bucket_file_size_limit",readonly \
    --mount type=bind,source="$(pwd)/secrets/next_public_supabase_bucket_allowed_mime_types",target="/run/secrets/next_public_supabase_bucket_allowed_mime_types",readonly \
    --mount type=bind,source="$(pwd)/secrets/next_public_supabase_user_table_name",target="/run/secrets/next_public_supabase_user_table_name",readonly \
    my-nextjs-app
```

### 5. Access the Application
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Running with Docker Compose

### 1. Ensure `docker-compose.yml` is Correct
Make sure the `docker-compose.yml` file includes all the necessary secrets and environment configurations.

### 2. Build the Docker Image
Run the following command to build the image with Docker Compose:
```bash
docker-compose build
```

### 3. Start the Services
Run the application:
```bash
docker-compose up
```

### 4. Access the Application
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Verify the Setup

### Check Secrets
If the container fails, ensure that all secret files exist and have the correct values:
```bash
ls -l secrets/
```

### View Logs
If the application doesn't start, check the logs like this:
```bash
docker logs <container_id>
docker-compose logs
```

---

## Cleaning Up

### Stop the Container
If running with the Dockerfile:
```bash
docker stop <container_id>
```

If running with Docker Compose:
```bash
docker-compose down
```

---

To run the Dockerfile alone and bind to **port 3000** with the required secrets, you need to follow these steps:

---

**Now to run the docker image without the docker compose file, follow the instructions below**


### 1. **Build the Docker Image**
Run the following command to build the Docker image:
```bash
docker build -t my-nextjs-app .
```

---

### 2. **Ensure the `secrets` Directory Exists**
Create the `secrets/` directory and populate it with the required files:
```bash
mkdir -p secrets

echo "<qdrant_host>.cloud.qdrant.io" > secrets/QDRANT_URL
echo "<qdrant_api_key>" > secrets/QDRANT_API_KEY
echo "postgresql://postgres.qxyxszjvfffbvrmsdcxt:#@@dfyttyy55464As@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" > secrets/next_public_supabase_url
echo "<supabase_anon_key>" > secrets/next_public_supabase_anon_key
echo "<supabase_bucket_name>" > secrets/next_public_supabase_bucket_name
echo "1MB" > secrets/next_public_supabase_bucket_file_size_limit
echo "null" > secrets/next_public_supabase_bucket_allowed_mime_types
echo "<supabase_table_name>" > secrets/next_public_supabase_user_table_name
```

Replace `<value>` placeholders with the actual values.

---

### 3. **Run the Container**
Run the container using the `docker run` command with the `--mount` flag for each secret:

```bash
docker run -p 3000:3000 \
    --mount type=bind,source="$(pwd)/secrets/QDRANT_URL",target="/run/secrets/QDRANT_URL",readonly \
    --mount type=bind,source="$(pwd)/secrets/QDRANT_API_KEY",target="/run/secrets/QDRANT_API_KEY",readonly \
    --mount type=bind,source="$(pwd)/secrets/next_public_supabase_url",target="/run/secrets/next_public_supabase_url",readonly \
    --mount type=bind,source="$(pwd)/secrets/next_public_supabase_anon_key",target="/run/secrets/next_public_supabase_anon_key",readonly \
    --mount type=bind,source="$(pwd)/secrets/next_public_supabase_bucket_name",target="/run/secrets/next_public_supabase_bucket_name",readonly \
    --mount type=bind,source="$(pwd)/secrets/next_public_supabase_bucket_file_size_limit",target="/run/secrets/next_public_supabase_bucket_file_size_limit",readonly \
    --mount type=bind,source="$(pwd)/secrets/next_public_supabase_bucket_allowed_mime_types",target="/run/secrets/next_public_supabase_bucket_allowed_mime_types",readonly \
    --mount type=bind,source="$(pwd)/secrets/next_public_supabase_user_table_name",target="/run/secrets/next_public_supabase_user_table_name",readonly \
    my-nextjs-app
```

---

### 4. **Access the Application**
Once the container is running, visit [http://localhost:3000](http://localhost:3000) in your browser.

---

### 5. **Verify Secrets Are Loaded**
If the application fails, you can check the logs or verify if the secrets are correctly mounted:

- **Check Secrets in the Container**:
   ```bash
   docker exec -it <container_id> cat /run/secrets/QDRANT_URL
   ```

- **View Logs**:
   ```bash
   docker logs <container_id>
   ```

Replace `<container_id>` with the actual container ID obtained using:
```bash
docker ps
```

---

### Key Notes:
1. **Binding Secrets**:
   Each `--mount` binds a file in the `secrets/` directory to a specific path inside the container.

2. **Runtime Errors**:
   Ensure the secrets directory is complete and accessible before running the container.

3. **Exposed Port**:
   The application binds to **port 3000** on the host, making it accessible via `http://localhost:3000`.

---


The choice between **running the Dockerfile directly with `docker run`** and using **Docker Compose** depends on your application's complexity and your workflow requirements. This is a comparison of the two approaches:

---

### **1. Running the Dockerfile with `docker run`**

#### **Advantages**
- **Simplicity**:
  - For a single-container setup, running a Dockerfile with `docker run` is straightforward.
  - It's a quick way to test or debug your Docker image without additional configurations.

- **Manual Control**:
  - You have direct control over the container runtime arguments, including `--mount` for secrets or volume bindings.
  - Useful for fine-tuning specific configurations during testing.

- **Lightweight**:
  - No need for additional tooling or configuration files (beyond the Dockerfile itself).

#### **Disadvantages**
- **Manual Configuration**:
  - You need to manually specify mounts, ports, and environment variables for each run.
  - Can be error-prone and repetitive if the setup involves multiple arguments or secrets.

- **Scalability**:
  - Running multiple containers or services becomes cumbersome, as you must manage dependencies and networking manually.

---

### **2. Using Docker Compose**

#### **Advantages**
- **Ease of Management**:
  - Compose lets you define all services, networks, volumes, secrets, and environment variables in a single `docker-compose.yml` file.
  - Easy to manage complex, multi-container applications.

- **Reusability**:
  - You can define reusable services and configurations, making it easier for team members or CI/CD pipelines to replicate the environment.

- **Secrets Management**:
  - Secrets can be defined and mounted automatically, reducing the risk of manual errors.

- **Networking**:
  - Docker Compose automatically creates a network for your services, simplifying communication between containers.

- **Scalability**:
  - Built-in support for scaling services (`docker-compose up --scale <service>=N`).

#### **Disadvantages**
- **Additional Setup**:
  - Requires creating and maintaining a `docker-compose.yml` file.
  - Adds a layer of abstraction that might not be necessary for very simple setups.

- **Overhead for Single-Container Apps**:
  - For simple, single-container applications, Compose may feel unnecessary and add complexity.

---

### **When to Use Each Approach**

| **Scenario**                                | **Preferred Approach**                |
|---------------------------------------------|---------------------------------------|
| Single-container app with simple setup      | `docker run`                          |
| Quick, one-off testing of the Docker image  | `docker run`                          |
| Multi-container application                 | `docker-compose`                      |
| Applications requiring networking           | `docker-compose`                      |
| Reusable or shared configurations           | `docker-compose`                      |
| Production-like environments with secrets   | `docker-compose`                      |
| Frequent environment updates or scaling     | `docker-compose`                      |

---

### **Conclusion**
- Use `docker run` for **lightweight, quick tests**, and when working with a **single container**.
- Use `docker-compose` for **complex applications**, **multi-service setups**, and when you want to **reuse configurations** or enable **team collaboration**.

If you're aiming for production environments or anticipate scaling and complexity in the future, **Docker Compose** is typically the better choice.

This instruction is a guide that ensures your application runs securely and reliably with Docker and Docker Compose while keeping secrets isolated.