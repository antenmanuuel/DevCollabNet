import os
import subprocess
import sys
import signal
import webbrowser

# Global variables to store process objects
server_process = None
client_process = None

def run_command(command, cwd=None):
    """
    Runs a shell command.
    """
    try:
        subprocess.run(command, cwd=cwd, check=True, shell=True)
    except subprocess.CalledProcessError as e:
        print(f"Error executing: {command}\n{e}")
        sys.exit(e.returncode)

def terminate_processes():
    """
    Terminates server and client processes if running.
    """
    global server_process, client_process
    if server_process and server_process.poll() is None:
        print("Terminating the server process...")
        server_process.terminate()
        server_process.wait()
        print("Server process terminated.")
    if client_process and client_process.poll() is None:
        print("Terminating the client process...")
        client_process.terminate()
        client_process.wait()
        print("Client process terminated.")

def signal_handler(sig, frame):
    """
    Signal handler to handle CTRL+C.
    """
    print("\nExiting and terminating processes...")
    terminate_processes()
    navigate_back()
    sys.exit(0)

def navigate_back():
    """
    Navigates back to the parent directory.
    """
    print("\nNavigating back to the parent directory...")
    os.chdir("..")
    print(f"Current directory: {os.getcwd()}")

def automate_setup():
    global server_process, client_process

    # Register signal handler for graceful termination
    signal.signal(signal.SIGINT, signal_handler)

    # Step 1: Install dependencies
    print("\nInstalling dependencies for client...")
    run_command("npm install", cwd="client")

    print("\nInstalling dependencies for server...")
    run_command("npm install", cwd="server")

    # Step 2: Run the server
    secret_key = input("Enter the server secret key: ")
    print("\nStarting the server...")
    server_process = subprocess.Popen(f"npm start {secret_key}", cwd="server", shell=True)

    # Check if the server started successfully
    if server_process.poll() is not None:
        print("Error: Failed to start the server. Exiting.")
        terminate_processes()
        navigate_back()
        sys.exit(1)
    else:
        print("Server is running.")

    # Step 3: Run the client
    print("\nStarting the client...")
    client_process = subprocess.Popen("npm start", cwd="client", shell=True)

    # Check if the client started successfully
    if client_process.poll() is not None:
        print("Error: Failed to start the client. Exiting.")
        terminate_processes()
        navigate_back()
        sys.exit(1)
    else:
        print("Client is running.")

    # Step 4: Open localhost:3000 in the default web browser
    print("\nOpening localhost:3000 in the default web browser...")
    webbrowser.open("http://localhost:3000")

    print("\nProject setup and execution complete!")
    print("Server and Client are running in separate processes.")

    # Keep the script running to allow manual termination
    try:
        while True:
            user_input = input("Enter 'stop' to terminate the processes: ").strip().lower()
            if user_input == "stop":
                break
    except KeyboardInterrupt:
        print("\nCTRL+C detected.")

    # Terminate processes before exiting
    terminate_processes()
    navigate_back()

if __name__ == "__main__":
    automate_setup()
