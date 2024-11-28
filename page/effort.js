const heading = [
    "Study requirement(Study document, study coding)",
    "Investigate bug impact",
    "Q&A",
    "Meeting Q&A",
    "Coding",
    "Create Unit Test",
    "Test Unit Test && Fix Bug",
];

const dailyWorkHours = 8;
const fixedDailyTasks = [
    { name: "Daily meeting", time: 0.5 },
    { name: "Daily report", time: 0.5 },
];
const weeklyMeetings = [
    { day: 2, name: "Weekly Sprint Grooming meeting", time: 2 },
    { day: 7, name: "Weekly Sprint Grooming meeting", time: 2 },
];
const totalWorkingDays = 10;

/**
* Generate work schedule ensuring 8h/day with 4-6 tasks/day.
* @param {Array<{itemId: string, effort: Record<string, string>}>} items - List of items with detailed efforts.
* @returns {Array<string>} Work schedule.
*/
function generateFixedEffortSchedules(items) {
    // Convert efforts from strings to numbers
    items.forEach((item) => {
        item.effort = Object.fromEntries(
            Object.entries(item.effort).map(([key, value]) => [
                key,
                parseFloat(value),
            ])
        );
    });

    // Initialize schedule
    const schedules = [];
    const progress = items.map((item) => ({
        itemId: item.itemId,
        headingQueue: heading.slice(),
        remainingEffort: { ...item.effort },
    }));

    // Distribute work for each day
    for (let day = 1; day <= totalWorkingDays; day++) {
        let dailyRemainingHours = dailyWorkHours;
        let dailyTasks = [];
        let taskCount = 0;

        // Add fixed daily tasks
        fixedDailyTasks.forEach((task) => {
            dailyTasks.push(`- ${task.name}: ${task.time}h`);
            dailyRemainingHours -= task.time;
            taskCount++;
        });

        // Add weekly meetings if applicable
        const weeklyMeeting = weeklyMeetings.find((meeting) => meeting.day === day);

        if (weeklyMeeting) {
            dailyTasks.push(`- ${weeklyMeeting.name}: ${weeklyMeeting.time}h`);
            dailyRemainingHours -= weeklyMeeting.time;
            taskCount++;
        }

        // Distribute effort among tasks (following heading order)
        while (taskCount < 6 && dailyRemainingHours > 0) {
            for (const item of progress) {
                const currentHeading = item.headingQueue[0];
                if (!currentHeading || dailyRemainingHours <= 0) continue;

                const effortLeft = item.remainingEffort[currentHeading];
                const timeToAssign = Math.min(dailyRemainingHours, effortLeft);

                if (timeToAssign > 0) {
                    dailyTasks.push(
                        `- ${currentHeading} ${item.itemId}: ${timeToAssign}h`
                    );
                    dailyRemainingHours -= timeToAssign;
                    taskCount++;

                    item.remainingEffort[currentHeading] -= timeToAssign;

                    if (item.remainingEffort[currentHeading] <= 0) {
                        item.headingQueue.shift(); // Move to next dau_muc
                    }
                }

                // Ensure we don't exceed the task limit for the day
                if (taskCount >= 6) break;
            }
        }

        // Ensure minimum 4 tasks per day
        while (
            taskCount < 4 &&
            progress.some((item) => item.headingQueue.length > 0)
        ) {
            const item = progress.find((p) => p.headingQueue.length > 0);
            const currentHeading = item.headingQueue[0];
            const timeToAssign = Math.min(dailyRemainingHours, 0.5); // Assign small amount for minimum task count

            dailyTasks.push(`- ${currentHeading} ${item.itemId}: ${timeToAssign}h`);
            dailyRemainingHours -= timeToAssign;
            taskCount++;

            item.remainingEffort[currentHeading] -= timeToAssign;

            if (item.remainingEffort[currentHeading] <= 0) {
                item.headingQueue.shift();
            }
        }

        // Log the daily schedule for debugging
        schedules.push(`Day ${day}:\n${dailyTasks.join("\n")}`);
    }

    return schedules;
}

// Example usage
const items = [
    {
        itemId: "6106",
        effort: {
            "Study requirement(Study document, study coding)": 2,
            "Investigate bug impact": 16,
            "Q&A": 2,
            "Meeting Q&A": 1,
            Coding: 10,
            "Create Unit Test": 4,
            "Test Unit Test && Fix Bug": 3,
        },
    },
    {
        itemId: "6061",
        effort: {
            "Study requirement(Study document, study coding)": 2,
            "Investigate bug impact": 8,
            "Q&A": 4,
            "Meeting Q&A": 1,
            Coding: 24,
            "Create Unit Test": 8,
            "Test Unit Test && Fix Bug": 4,
        },
    },
];

const checkEffortActual = () => {
    let listItem = [];
    let effortActual = 0;
    items.forEach((item) => {
        let effort = 0;

        Object.keys(item.effort).forEach((element) => {
            effort += item.effort[element];
            effortActual += item.effort[element];
        });

        listItem.push({ item: item.itemId, effort });
    });

    // effort for 10 day is 80, apart from weekly and daily metting is 80 - (1 * 7 + 2 * 2) = 66 (hour)
    if (effortActual !== 66) {
        return "ERROR: Effort actual must be 66";
    }

    return { listItem, effortActual };
};

console.log(checkEffortActual());

const schedules = generateFixedEffortSchedules(items);

// Print schedules to check the results
console.log(schedules.join("\n\n"));