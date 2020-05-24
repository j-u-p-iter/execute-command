import { spawn } from "child_process";
import concat from "concat-stream";

const runProcess = (processPath, args = []) => {
  return spawn("node", [processPath, ...args]);
};

type ExecuteCommandFn = (params: {
  pathToBin: string;
  args?: string[];
  inputs?: string[];
}) => Promise<string>;

export const executeCommand: ExecuteCommandFn = (
  { pathToBin, args = [], inputs = [] } = {} as any
) => {
  return new Promise((resolve, reject) => {
    const childProcess = runProcess(pathToBin, args);

    let processTimeout;

    // Creates a loop to feed user inputs to the child process
    // in order to get results from the tool
    // This code is heavily inspired (if not blantantly copied)
    // from inquirer-test package
    const loopProcess = inputsArg => {
      if (!inputs.length) {
        childProcess.stdin.end();
        return;
      }

      processTimeout = setTimeout(() => {
        childProcess.stdin.write(inputsArg[0]);
        loopProcess(inputsArg.slice(1));
      }, 100);
    };

    loopProcess(inputs);

    childProcess.on("error", reject);

    childProcess.stderr.once("data", error => {
      // If childProcess errors out, stop all
      // the pending inputs if any
      childProcess.stdin.end();

      if (processTimeout) {
        clearTimeout(processTimeout);
        inputs = [];
      }

      reject(error.toString().trim());
    });

    childProcess.stdout.pipe(
      concat(output => {
        resolve(output.toString().trim());
      })
    );
  });
};
