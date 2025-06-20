# SEC-bench Experiments

This repository contains the predictions, execution logs, trajectories, and results for model inference + evaluation runs on the [SEC-bench](https://github.com/SEC-bench/SEC-bench) task.

## 🏅 Leaderboard Submission

If you are interested in submitting your model to the [SEC-bench Leaderboard](https://github.com/SEC-bench/sec-bench.github.io/), please do the following:
1. Fork this repository.
2. Clone the repository. Due to this repository's large diff history, consider using `git clone --depth 1` if cloning takes too long.
3. Under the task that you evaluate on (e.g. `evaluation/Patch/`), create a new folder with the model name (e.g. `swea_o3-mini`).
4. Within the folder (`evaluation/<task>/<model>`), please include the following **required** assets:

   - `report.jsonl`: A Report file that summarizes the evaluation results
   - `metadata.yaml`: Metadata for how result is shown on website. Please include the following fields:
     -  `name`: The name of your leaderboard entry</li>
     -  `orgIcon` (optional): URL/link to an icon representing your organization
     -  `oss`: <code>true</code> if your system is open-source
     -  `site`: URL/link to more information about your system
     -  `verified`: <code>false</code> (See below for [results verification](#-results-verification))
     -  `date`: Date of submission
   - `logs/`: SEC-bench evaluation artifacts dump, which stores the contents of the language folder after the evaluation.
   - `trajs/`: Reasoning trace reflecting how your system solved the problem</li>
     - Submit one reasoning trace per task instance. The reasoning trace should show all of the steps your system took while solving the task. If your system outputs thoughts or comments during operation, they should be included as well.</li>
     - The reasoning trace can be represented with any text based file format (e.g. <code>md</code>, <code>json</code>, <code>yaml</code>)</li>
     - Ensure the task instance ID is in the name of the corresponding reasoning trace file.</li>
5. Create a pull request to this repository with the new folder, and the leaderboard will automatically update once the PR is merged.

## ✅ Results Verification
The Verified check ✓ indicates that we (the SEC-bench team) received access to the model and were able to reproduce the patch generations.

If you are interested in receiving the "verified" checkmark ✓ on your submission, please do the following:

1. Create an issue.
2. In the issue, provide us instructions on how to run your model on SEC-bench.
3. We will run your model on a random subset of SEC-bench and verify the results.

## 🙏 Acknowledgements
We express our deepest gratitude to the creators of the [Multi-SWE-bench](https://multi-swe-bench.github.io) and [SWE-bench](https://www.swebench.com) datasets. This repository is a modified version of their original [website repository](https://github.com/multi-swe-bench/multi-swe-bench.github.io). 

## 📄 Citation

If you found [SEC-bench](https://arxiv.org/abs/2506.11791) helpful for your work, please cite as follows:

```
@article{lee2025sec,
  title={SEC-bench: Automated Benchmarking of LLM Agents on Real-World Software Security Tasks},
  author={Lee, Hwiwon and Zhang, Ziqi and Lu, Hanxiao and Zhang, Lingming},
  journal={arXiv preprint arXiv:2506.11791},
  year={2025}
}
```

## 📜 License
This project is licensed under Apache License 2.0. See the [LICENSE](/LICENSE) flie for details.