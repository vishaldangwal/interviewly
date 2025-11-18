import { Clock, Code2, Calendar, Users } from "lucide-react";

export const INTERVIEW_CATEGORY = [
  { id: "upcoming", title: "Upcoming Interviews", variant: "outline" },
  { id: "completed", title: "Completed", variant: "secondary" },
  { id: "succeeded", title: "Succeeded", variant: "default" },
  { id: "failed", title: "Failed", variant: "destructive" },
] as const;

export const TIME_SLOTS = [
  "00:00",
  "00:30",
  "01:30",
  "02:00",
  "02:30",
  "01:00",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
  "21:30",
  "22:00",
  "22:30",
  "23:00",
  "23:30",
];

export const QUICK_ACTIONS = [
  {
    icon: Code2,
    title: "New Call",
    description: "Start an instant call",
    color: "primary",
    gradient: "from-primary/10 via-primary/5 to-transparent",
  },
  {
    icon: Users,
    title: "Join Interview",
    description: "Enter via invitation link",
    color: "blue-500",
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
  },
  {
    icon: Calendar,
    title: "Schedule",
    description: "Plan upcoming interviews",
    color: "blue-500",
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
  },
  {
    icon: Clock,
    title: "Recordings",
    description: "Access past interviews",
    color: "orange-500",
    gradient: "from-orange-500/10 via-orange-500/5 to-transparent",
  },
];

export const CODING_QUESTIONS01: CodeQuestion[] = [
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    description:
      "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.",
    examples: [
      { input: `s = "()"`, output: "true" },
      { input: `s = "()[]{}"`, output: "true" },
      { input: `s = "(]"`, output: "false" },
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists only of parentheses '()[]{}'",
    ],
    starterCode: {
      javascript: `function isValid(s) {
  // Write your solution here
}`,
      python: `def is_valid(s):
    # Write your solution here
    pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Write your solution here
    }
}`,
      cpp: `#include <stack>
#include <string>
using namespace std;

bool isValid(string s) {
    // Write your solution here
}`,
    },
  },
  {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    description:
      "You are given the heads of two sorted linked lists `list1` and `list2`.\nMerge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.",
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" },
      { input: "list1 = [], list2 = []", output: "[]" },
      { input: "list1 = [], list2 = [0]", output: "[0]" },
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50]",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order.",
    ],
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {
  // Write your solution here
}`,
      python: `def merge_two_lists(list1, list2):
    # Write your solution here
    pass`,
      java: `class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Write your solution here
    }
}`,
      cpp: `ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    // Write your solution here
}`,
    },
  },
  {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    description:
      "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`-th day.\n\nYou want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation:
          "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5.",
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "No profitable transaction possible.",
      },
    ],
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    starterCode: {
      javascript: `function maxProfit(prices) {
  // Write your solution here
}`,
      python: `def max_profit(prices):
    # Write your solution here
    pass`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Write your solution here
    }
}`,
      cpp: `#include <vector>
using namespace std;

int maxProfit(vector<int>& prices) {
    // Write your solution here
}`,
    },
  },

  // New Problems Added Below

  {
    id: "two-sum",
    title: "Two Sum",
    description:
      "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.",
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
}`,
      python: `def two_sum(nums, target):
    # Write your solution here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
    }
}`,
      cpp: `#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here
}`,
    },
  },

  {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    description:
      "Given an integer array `nums`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "Subarray [4,-1,2,1] has the largest sum = 6.",
      },
      { input: "nums = [1]", output: "1" },
    ],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Write your solution here
}`,
      python: `def max_sub_array(nums):
    # Write your solution here
    pass`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Write your solution here
    }
}`,
      cpp: `#include <vector>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Write your solution here
}`,
    },
  },
];
export const LANGUAGES = [
  { id: "cpp", name: "C++", icon: "/cpp.png" },
  { id: "javascript", name: "JavaScript", icon: "/javascript.png" },
  { id: "python", name: "Python", icon: "/python.png" },
  { id: "java", name: "Java", icon: "/java.png" },
] as const;

export interface CodeQuestion {
  id: string;
  title: string;
  description: string;
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
  constraints?: string[];
}

export type QuickActionType = (typeof QUICK_ACTIONS)[number];
