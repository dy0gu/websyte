# Personal Page 📚💻

Simple landing page for my personal website, with a few links and a couple secrets.

## Requirements 📋

- Node 22.0.0+
- Docker Engine 25.0.0+
- Docker Compose 2.24.0+

## Development 🛠️

- Clone the repository:

  ```shell
  git clone https://github.com/dy0gu/websyte.git
  ```

- Install the dependencies:

  ```shell
  npm install
  ```

- Start the development server:

  ```shell
  npm run dev
  ```

  ### Tooling 🧰

  - Biome is used as a linter and formatter:

    ```shell
    npm run check

    # When installing dependencies, pre-commit hooks are added to lint and format automatically.
    # If for some reason the hooks do not install correctly, do it manually:
    npx lefthook install

    # When using pre-commit hooks, git commands will fail if any files are checked with errors.
    # Changed files must be added to the staged area and commited again to apply fixes.
    ```

## Deployment 🚀

- Run the docker compose:

  ```shell
  docker compose up --build --force-recreate -d
  ```
