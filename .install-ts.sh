#!/bin/baash
# Install TypeScript globally
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install Node.js and npm first."
    exit 1
fi
npm install -g typescript
if [ $? -ne 0 ]; then
    echo "Failed to install TypeScript."
    exit 1
fi
echo "TypeScript installed successfully."
# Verify installation
tsc --version
if [ $? -ne 0 ]; then
    echo "TypeScript installation verification failed."
    exit 1
fi
echo "TypeScript is installed and working correctly."
# Create a sample TypeScript file
echo "Creating a sample TypeScript file..."
echo "const greeting: string = 'Hello, TypeScript!'; console.log(greeting);" > sample.ts

npx tsc --init
if [ $? -ne 0 ]; then
    echo "Failed to initialize TypeScript configuration."
    exit 1
fi
echo "Sample TypeScript file created successfully."
# Compile the sample TypeScript file
npx tsc sample.ts
if [ $? -ne 0 ]; then
    echo "Failed to compile the sample TypeScript file."
    exit 1
fi
echo "Sample TypeScript file compiled successfully."
# Run the compiled JavaScript file
node sample.js
if [ $? -ne 0 ]; then
    echo "Failed to run the compiled JavaScript file."
    exit 1
fi
echo "Compiled JavaScript file ran successfully."
# Clean up the sample files
rm sample.ts sample.js
echo "Sample files cleaned up successfully."
echo "TypeScript installation and setup completed successfully."
# End of script
# Exit the script
exit 0
# End of script
# This script installs TypeScript globally, creates a sample TypeScript file, compiles it, and runs the compiled JavaScript file.
# It also initializes a TypeScript configuration file and cleans up the sample files after execution.
# Ensure the script is executable
chmod +x .install-ts.sh