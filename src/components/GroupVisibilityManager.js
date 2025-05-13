import { useState } from "react";

export const GroupVisibilityManager = ({
  render,
  onToggleAllGroups,
  onToggleGroup,
  hiddenGroups,
  groupVisibility,
}) => {
  return (
    <div className="visibility-manager">
      {render({
        toggleAllGroupsVisibility: onToggleAllGroups,
        toggleGroupVisibility: onToggleGroup,
        hiddenGroups,
        groupVisibility,
      })}
    </div>
  );
};

export const useGroupVisibility = (initialGroups = [], taskGroups = []) => {
  const [hiddenGroups, setHiddenGroups] = useState([]);
  const [groupVisibility, setGroupVisibility] = useState({});
  
  const toggleAllGroupsVisibility = () => {
    if (hiddenGroups.length > 0) {
      setHiddenGroups([]);
    } else {
      const completedGroups = taskGroups.filter(group => {
        const totalHours = group.tasks.reduce(
          (sum, task) => sum + (parseFloat(task.hours) || 0),
          0
        );
        return totalHours >= 9;
      }).map(group => group.id);
      
      setHiddenGroups(completedGroups);
    }
  };

  const toggleGroupVisibility = (groupId) => {
    setGroupVisibility((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return {
    hiddenGroups,
    groupVisibility,
    toggleAllGroupsVisibility,
    toggleGroupVisibility,
  };
};