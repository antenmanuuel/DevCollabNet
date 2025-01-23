import os
import subprocess
import sys

def run_command(command, cwd=None):
    """
    Runs a shell command.
    """
    try:
        subprocess.run(command, cwd=cwd, check=True, shell=True)
    except subprocess.CalledProcessError as e:
        print(f"Error executing: {command}\n{e}")
        sys.exit(e.returncode)

def automate_setup():
    # Step 1: Install dependencies
    print("\nInstalling dependencies for client...")
    run_command("npm install", cwd="client")

    print("\nInstalling dependencies for server...")
    run_command("npm install", cwd="server")

    # Step 2: Initialize the database
    email_of_admin = input("Enter admin email: ")
    password_of_admin = input("Enter admin password: ")

    print("\nInitializing the database...")
    run_command(f"node init.js {email_of_admin} {password_of_admin}", cwd="server")

    # Step 3: Run the server
    secret_key = input("Enter the server secret key: ")
    print("\nStarting the server...")
    server_process = subprocess.Popen(f"npm start {secret_key}", cwd="server", shell=True)

    if server_process.poll() is not None:
        print("Error: Failed to start the server. Exiting.")
        sys.exit(1)
    else:
        print("Server is running.")

    # Step 4: Run the client
    print("\nStarting the client...")
    client_process = subprocess.Popen("npm start", cwd="client", shell=True)

    if client_process.poll() is not None:
        print("Error: Failed to start the client. Exiting.")
        sys.exit(1)
    else:
        print("Client is running.")

    print("\nProject setup and execution complete!")
    print("Server and Client are running in separate processes.")

if __name__ == "__main__":
    automate_setup()
