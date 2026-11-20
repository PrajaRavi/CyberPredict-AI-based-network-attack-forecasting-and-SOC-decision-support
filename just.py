def fcfs_scheduling():
    # Step 1: Take input for the number of processes
    n = int(input("Enter the number of processes: "))
    processes = []

    # Step 2: Take input for Arrival Time (AT) and Burst Time (BT) for each process
    for i in range(n):
        pid = f"p{i+1}"
        print(f"\n--- Enter details for Process {pid} ---")
        at = int(input(f"Arrival Time (AT) for {pid}: "))
        bt = int(input(f"Burst Time (BT) for {pid}: "))
        processes.append({"pid": pid, "at": at, "bt": bt})

    # Sort processes by Arrival Time to ensure proper FCFS execution order
    processes.sort(key=lambda x: x["at"])

    # Step 3: Display the input table with rows for Process ID, AT, and BT
    print("\n" + "="*50)
    print("INITIAL PROCESS TABLE")
    print("="*50)
    
    # Row 1: Process IDs
    print(f"{'Process ID':<15} : " + "  ".join([f"{p['pid']:<5}" for p in processes]))
    # Row 2: Arrival Times
    print(f"{'Arrival Time':<15} : " + "  ".join([f"{p['at']:<5}" for p in processes]))
    # Row 3: Burst Times
    print(f"{'Burst Time':<15} : " + "  ".join([f"{p['bt']:<5}" for p in processes]))
    print("="*50)

    # Step 4: Further processing (Calculate CT, TAT, WT)
    current_time = 0
    total_wt = 0
    total_tat = 0

    for p in processes:
        # If the CPU is idle until the process arrives
        if current_time < p["at"]:
            current_time = p["at"]
        
        p["ct"] = current_time + p["bt"]     # Completion Time
        current_time = p["ct"]
        
        p["tat"] = p["ct"] - p["at"]         # Turnaround Time = CT - AT
        p["wt"] = p["tat"] - p["bt"]         # Waiting Time = TAT - BT
        
        total_wt += p["wt"]
        total_tat += p["tat"]

    # Step 5: Display final detailed result table
    print("\n" + "="*60)
    print("FCFS SCHEDULING RESULT TABLE")
    print("="*60)
    print(f"{'Process':<10}{'AT':<10}{'BT':<10}{'CT':<10}{'TAT':<10}{'WT':<10}")
    print("-" * 60)
    
    for p in processes:
        print(f"{p['pid']:<10}{p['at']:<10}{p['bt']:<10}{p['ct']:<10}{p['tat']:<10}{p['wt']:<10}")
    
    print("-" * 60)

    # Step 6: Calculate and show average waiting time and average turnaround time
    avg_wt = total_wt / n
    avg_tat = total_tat / n

    print(f"\nAverage Waiting Time: {avg_wt:.2f}")
    print(f"Average Turnaround Time: {avg_tat:.2f}")

if __name__ == "__main__":
    fcfs_scheduling()

def sjf_scheduling():
    # Step 1: Take input for the number of processes
    n = int(input("Enter the number of processes: "))
    processes = []

    # Step 2: Take input for Arrival Time (AT) and Burst Time (BT) for each process
    for i in range(n):
        pid = f"p{i+1}"
        print(f"\n--- Enter details for Process {pid} ---")
        at = int(input(f"Arrival Time (AT) for {pid}: "))
        bt = int(input(f"Burst Time (BT) for {pid}: "))
        processes.append({"pid": pid, "at": at, "bt": bt, "completed": False})

    # Sort processes by Arrival Time initially for a neat input display table
    processes_display = sorted(processes, key=lambda x: x["at"])

    # Step 3: Display the input table with rows for Process ID, AT, and BT
    print("\n" + "="*50)
    print("INITIAL PROCESS TABLE")
    print("="*50)
    
    # Row 1: Process IDs
    print(f"{'Process ID':<15} : " + "  ".join([f"{p['pid']:<5}" for p in processes_display]))
    # Row 2: Arrival Times
    print(f"{'Arrival Time':<15} : " + "  ".join([f"{p['at']:<5}" for p in processes_display]))
    # Row 3: Burst Times
    print(f"{'Burst Time':<15} : " + "  ".join([f"{p['bt']:<5}" for p in processes_display]))
    print("="*50)

    # Step 4: SJF Processing Logic (Non-Preemptive)
    current_time = 0
    completed = 0
    total_wt = 0
    total_tat = 0
    scheduled_processes = []

    while completed < n:
        # Find all processes that have arrived by current_time and are not yet completed
        available = [p for p in processes if p["at"] <= current_time and not p["completed"]]
        
        if not available:
            # If CPU is idle, jump time to the next arriving process
            uncompleted = [p for p in processes if not p["completed"]]
            if uncompleted:
                next_p = min(uncompleted, key=lambda x: x["at"])
                current_time = next_p["at"]
            continue
        
        # Pick the process with the shortest Burst Time (BT)
        # Tie-breaker: if BTs are equal, pick the one with the earliest Arrival Time (AT)
        
        shortest = min(available, key=lambda x: (x["bt"], x["at"]))
        # !here this min function retruns the refrance of the actual object inside list it doesn't return copy of that object so changes in that object will also happend the object inside the list because both are same

        # Calculate scheduling metrics 
        shortest["ct"] = current_time + shortest["bt"]     # Completion Time
        current_time = shortest["ct"]
        
        shortest["tat"] = shortest["ct"] - shortest["at"]   # Turnaround Time
        shortest["wt"] = shortest["tat"] - shortest["bt"]   # Waiting Time
        
        shortest["completed"] = True
        completed += 1
        
        total_wt += shortest["wt"]
        total_tat += shortest["tat"]
        
        scheduled_processes.append(shortest)

    # Sort final output list by Completion Time or Process ID for a clean summary table
    scheduled_processes.sort(key=lambda x: x["ct"])

    # Step 5: Display final detailed result table
    print("\n" + "="*60)
    print("SJF (NON-PREEMPTIVE) SCHEDULING RESULT TABLE")
    print("="*60)
    print(f"{'Process':<10}{'AT':<10}{'BT':<10}{'CT':<10}{'TAT':<10}{'WT':<10}")
    print("-" * 60)
    
    for p in scheduled_processes:
        print(f"{p['pid']:<10}{p['at']:<10}{p['bt']:<10}{p['ct']:<10}{p['tat']:<10}{p['wt']:<10}")
    
    print("-" * 60)

    # Step 6: Calculate and show average waiting time and average turnaround time
    avg_wt = total_wt / n
    avg_tat = total_tat / n

    print(f"\nAverage Waiting Time: {avg_wt:.2f}")
    print(f"Average Turnaround Time: {avg_tat:.2f}")

if __name__ == "__main__":
    sjf_scheduling()

def priority_scheduling():
    # Step 1: Take input for the number of processes
    n = int(input("Enter the number of processes: "))
    processes = []

    # Step 2: Take input for Arrival Time (AT), Burst Time (BT), and Priority
    for i in range(n):
        pid = f"p{i+1}"
        print(f"\n--- Enter details for Process {pid} ---")
        at = int(input(f"Arrival Time (AT) for {pid}: "))
        bt = int(input(f"Burst Time (BT) for {pid}: "))
        # Note: Lower numerical value means higher priority (e.g., Priority 1 > Priority 3)
        priority = int(input(f"Priority for {pid} (Lower number = Higher priority): "))
        processes.append({"pid": pid, "at": at, "bt": bt, "priority": priority, "completed": False})

    # Sort processes by Arrival Time initially for a neat input display table
    processes_display = sorted(processes, key=lambda x: x["at"])

    # Step 3: Display the input table with rows for Process ID, AT, BT, and Priority
    print("\n" + "="*60)
    print("INITIAL PROCESS TABLE")
    print("="*60)
    
    # Row 1: Process IDs
    print(f"{'Process ID':<15} : " + "  ".join([f"{p['pid']:<5}" for p in processes_display]))
    # Row 2: Arrival Times
    print(f"{'Arrival Time':<15} : " + "  ".join([f"{p['at']:<5}" for p in processes_display]))
    # Row 3: Burst Times
    print(f"{'Burst Time':<15} : " + "  ".join([f"{p['bt']:<5}" for p in processes_display]))
    # Row 4: Priorities
    print(f"{'Priority':<15} : " + "  ".join([f"{p['priority']:<5}" for p in processes_display]))
    print("="*60)

    # Step 4: Priority Scheduling Logic (Non-Preemptive)
    current_time = 0
    completed = 0
    total_wt = 0
    total_tat = 0
    scheduled_processes = []

    while completed < n:
        # Find all processes that have arrived by current_time and are not yet completed
        available = [p for p in processes if p["at"] <= current_time and not p["completed"]]
        
        if not available:
            # If CPU is idle, jump time to the next arriving process
            uncompleted = [p for p in processes if not p["completed"]]
            if uncompleted:
                next_p = min(uncompleted, key=lambda x: x["at"])
                current_time = next_p["at"]
            continue
        
        # Pick the process with the highest priority (lowest numerical value)
        # Tie-breaker: if priorities are equal, pick the one with the earliest Arrival Time (AT)
        highest_priority = min(available, key=lambda x: (x["priority"], x["at"]))
        
        # Calculate scheduling metrics
        highest_priority["ct"] = current_time + highest_priority["bt"]     # Completion Time
        current_time = highest_priority["ct"]
        
        highest_priority["tat"] = highest_priority["ct"] - highest_priority["at"]   # Turnaround Time
        highest_priority["wt"] = highest_priority["tat"] - highest_priority["bt"]   # Waiting Time
        
        highest_priority["completed"] = True
        completed += 1
        
        total_wt += highest_priority["wt"]
        total_tat += highest_priority["tat"]
        
        scheduled_processes.append(highest_priority)

    # Sort final output list by Completion Time for a clean summary table
    scheduled_processes.sort(key=lambda x: x["ct"])

    # Step 5: Display final detailed result table
    print("\n" + "="*65)
    print("PRIORITY SCHEDULING (NON-PREEMPTIVE) RESULT TABLE")
    print("="*65)
    print(f"{'Process':<10}{'AT':<10}{'BT':<10}{'Priority':<10}{'CT':<10}{'TAT':<10}{'WT':<10}")
    print("-" * 65)
    
    for p in scheduled_processes:
        print(f"{p['pid']:<10}{p['at']:<10}{p['bt']:<10}{p['priority']:<10}{p['ct']:<10}{p['tat']:<10}{p['wt']:<10}")
    
    print("-" * 65)

    # Step 6: Calculate and show average waiting time and average turnaround time
    avg_wt = total_wt / n
    avg_tat = total_tat / n

    print(f"\nAverage Waiting Time: {avg_wt:.2f}")
    print(f"Average Turnaround Time: {avg_tat:.2f}")

if __name__ == "__main__":
    priority_scheduling()

def round_robin_scheduling():
    # Step 1: Take input for the number of processes and time quantum
    n = int(input("Enter the number of processes: "))
    time_quantum = int(input("Enter the Time Quantum: "))
    processes = []

    # Step 2: Take input for Arrival Time (AT) and Burst Time (BT) for each process
    for i in range(n):
        pid = f"p{i+1}"
        print(f"\n--- Enter details for Process {pid} ---")
        at = int(input(f"Arrival Time (AT) for {pid}: "))
        bt = int(input(f"Burst Time (BT) for {pid}: "))
        processes.append({
            "pid": pid, 
            "at": at, 
            "bt": bt, 
            "rem_bt": bt,  # Remaining Burst Time for tracking execution slices
            "visited": False
        })

    # Sort processes by Arrival Time initially for a neat input display table
    processes_display = sorted(processes, key=lambda x: x["at"])

    # Step 3: Display the input table with rows for Process ID, AT, and BT
    print("\n" + "="*50)
    print("INITIAL PROCESS TABLE")
    print("="*50)
    
    # Row 1: Process IDs
    print(f"{'Process ID':<15} : " + "  ".join([f"{p['pid']:<5}" for p in processes_display]))
    # Row 2: Arrival Times
    print(f"{'Arrival Time':<15} : " + "  ".join([f"{p['at']:<5}" for p in processes_display]))
    # Row 3: Burst Times
    print(f"{'Burst Time':<15} : " + "  ".join([f"{p['bt']:<5}" for p in processes_display]))
    print(f"{'Time Quantum':<15} : {time_quantum}")
    print("="*50)

    # Step 4: Round Robin Processing Logic
    current_time = 0
    completed = 0
    total_wt = 0
    total_tat = 0
    queue = []
    finished_processes = []

    # Sort all processes by arrival time for queue scheduling
    all_procs = sorted(processes, key=lambda x: x["at"])
    
    # Fast forward current time if the first process arrives later than 0
    if all_procs[0]["at"] > 0:
        current_time = all_procs[0]["at"]

    # Push all processes that arrive at the starting time into the ready queue
    idx = 0
    while idx < n and all_procs[idx]["at"] <= current_time:
        queue.append(all_procs[idx])
        all_procs[idx]["visited"] = True
        idx += 1

    while queue:
        p = queue.pop(0)
        
        # Execute process for the time quantum or its remaining burst time, whichever is smaller
        exec_time = min(p["rem_bt"], time_quantum)
        p["rem_bt"] -= exec_time
        current_time += exec_time

        # Add newly arrived processes to the queue up to the updated current time
        while idx < n and all_procs[idx]["at"] <= current_time:
            if not all_procs[idx]["visited"]:
                queue.append(all_procs[idx])
                all_procs[idx]["visited"] = True
            idx += 1

        # If the process still has remaining burst time, push it back to the queue
        if p["rem_bt"] > 0:
            queue.append(p)
        else:
            # Process has finished execution
            p["ct"] = current_time
            p["tat"] = p["ct"] - p["at"]
            p["wt"] = p["tat"] - p["bt"]
            
            total_wt += p["wt"]
            total_tat += p["tat"]
            
            finished_processes.append(p)
            completed += 1

        # Handle CPU idle time if the queue becomes empty but processes remain
        if not queue and completed < n:
            if idx < n:
                current_time = all_procs[idx]["at"]
                queue.append(all_procs[idx])
                all_procs[idx]["visited"] = True
                idx += 1

    # Sort finished processes back by Process ID for a clean presentation
    finished_processes.sort(key=lambda x: int(x["pid"][1:]))

    # Step 5: Display final detailed result table
    print("\n" + "="*60)
    print("ROUND ROBIN SCHEDULING RESULT TABLE")
    print("="*60)
    print(f"{'Process':<10}{'AT':<10}{'BT':<10}{'CT':<10}{'TAT':<10}{'WT':<10}")
    print("-" * 60)
    
    for p in finished_processes:
        print(f"{p['pid']:<10}{p['at']:<10}{p['bt']:<10}{p['ct']:<10}{p['tat']:<10}{p['wt']:<10}")
    
    print("-" * 60)

    # Step 6: Calculate and show average waiting time and average turnaround time
    avg_wt = total_wt / n
    avg_tat = total_tat / n

    print(f"\nAverage Waiting Time: {avg_wt:.2f}")
    print(f"Average Turnaround Time: {avg_tat:.2f}")

if __name__ == "__main__":
    round_robin_scheduling()

def bankers_algorithm():
    print("--- Banker's Algorithm (Deadlock Avoidance) ---")
    
    # Step 1: Take input for the number of processes and resource types
    n = int(input("Enter the number of processes: "))
    m = int(input("Enter the number of resource types: "))

    # Step 2: Take input for Allocation Matrix
    print("\nEnter Allocation Matrix (space-separated values for each resource):")
    allocation = []
    for i in range(n):
        row = list(map(int, input(f"Process p{i+1} allocation: ").split()))
        allocation.append(row)

    # Step 3: Take input for Max Matrix
    print("\nEnter Max Matrix (maximum demand for each resource):")
    max_matrix = []
    for i in range(n):
        row = list(map(int, input(f"Process p{i+1} max demand: ").split()))
        max_matrix.append(row)

    # Step 4: Take input for Available Resources
    print("\nEnter Available Resources:")
    available = list(map(int, input(f"Available resources (space-separated for {m} types): ").split()))

    # Step 5: Calculate Need Matrix = Max - Allocation
    need = []
    for i in range(n):
        row = [max_matrix[i][j] - allocation[i][j] for j in range(m)]
        need.append(row)

    # Step 6: Display the system state tables
    print("\n" + "="*65)
    print("SYSTEM STATE MATRICES")
    print("="*65)
    
    resource_names = [f"R{j+1}" for j in range(m)]
    header = f"{'Process':<10} | " + " ".join([f"{r:<5}" for r in resource_names])
    
    print("\n[Allocation Matrix]")
    print(header)
    print("-" * 40)
    for i in range(n):
        row_str = " ".join([f"{val:<5}" for val in allocation[i]])
        print(f"p{i+1:<9} | {row_str}")

    print("\n[Max Matrix]")
    print(header)
    print("-" * 40)
    for i in range(n):
        row_str = " ".join([f"{val:<5}" for val in max_matrix[i]])
        print(f"p{i+1:<9} | {row_str}")

    print("\n[Need Matrix (Max - Allocation)]")
    print(header)
    print("-" * 40)
    for i in range(n):
        row_str = " ".join([f"{val:<5}" for val in need[i]])
        print(f"p{i+1:<9} | {row_str}")

    print("\n[Available Resources]")
    print("  ".join([f"{r:<5}" for r in resource_names]))
    print("  ".join([f"{val:<5}" for val in available]))
    print("="*65)

    # Step 7: Safety Algorithm Logic
    work = list(available)
    finish = [False] * n
    safe_sequence = []

    while len(safe_sequence) < n:
        found = False
        for i in range(n):
            if not finish[i]:
                # Check if Need for process i is less than or equal to Work
                if all(need[i][j] <= work[j] for j in range(m)):
                    # If resources can be allocated, release allocation back to work
                    for j in range(m):
                        work[j] += allocation[i][j]
                    
                    safe_sequence.append(f"p{i+1}")
                    finish[i] = True
                    found = True
                    break
        
        # If no process could be allocated in this loop iteration, break out (unsafe)
        if not found:
            break

    # Step 8: Display Final Safety Result
    print("\n" + "="*65)
    print("BANKER'S ALGORITHM SAFETY CHECK RESULT")
    print("="*65)
    if len(safe_sequence) == n:
        print("Status: System is in a **SAFE STATE** ✅")
        print("Safe Sequence: " + " -> ".join(safe_sequence))
    else:
        print("Status: System is in an **UNSAFE STATE** ❌ (Risk of Deadlock)")
    print("="*65)

if __name__ == "__main__":
    bankers_algorithm()
