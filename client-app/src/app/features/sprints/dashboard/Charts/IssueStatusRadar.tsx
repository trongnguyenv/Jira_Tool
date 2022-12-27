import React, { PureComponent } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { useStore } from '../../../../stores/store';
import { observer } from 'mobx-react-lite';


export default observer(function IssueStatusRadar () {

  const { issueStore } = useStore();

  function calculateIssuesStatusPercentages(active_or_all_sprints: string) {
    var n_issues = 0;
    var n_todo = 0;
    var n_inprogress = 0;
    var n_review = 0;
    var n_done = 0;

    if(active_or_all_sprints == "Active"){
      var sprint = issueStore.selectedProject!.sprints.find(sprint => sprint.is_active === true); 
      n_issues = n_issues + sprint!.issues.length;
      n_todo = sprint!.issues.filter(issue => issue.status === "To Do").length;
      n_inprogress = sprint!.issues.filter(issue => issue.status === "In Progress").length;
      n_review = sprint!.issues.filter(issue => issue.status === "Review").length;
      n_done = sprint!.issues.filter(issue => issue.status === "Done").length;

      var data = [
        {
          status: 'To Do',
          n: n_todo
        },
        {
          status: 'In Progress',
          n: n_inprogress
        },
        {
          status: 'Review',
          n: n_review
        },
        {
          status: 'Done',
          n: n_done
        }  
      ];
      
      console.log("Radar chart data = ");
      console.log(data);

      return data;
    } else {
      issueStore.selectedProject!.sprints.map(sprint => {
        
          n_issues = n_issues + sprint.issues.length;
          n_todo = n_todo + sprint.issues.filter(issue => issue.status === "To Do").length;
          n_inprogress = n_inprogress + sprint.issues.filter(issue => issue.status === "In Progress").length;
          n_review = n_review + sprint.issues.filter(issue => issue.status === "Review").length;
          n_done = n_done + sprint.issues.filter(issue => issue.status === "Done").length;
      })
      var data_percentage = [
        {
          status: 'To Do',
          percentage: Math.round(n_todo / n_issues)
        },
        {
          status: 'In Progress',
          percentage: Math.round(n_inprogress / n_issues)
        },
        {
          status: 'Review',
          percentage: Math.round(n_review / n_issues)
        },
        {
          status: 'Done',
          percentage: Math.round(n_done / n_issues)
        }  
      ];
      return data_percentage;  
    }
  }

    return (
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="60%" data={calculateIssuesStatusPercentages("Active")}>
          <PolarGrid textRendering="#FFFFFF" fill="#FFFFFF" stroke="#FFFFFF" />
          <PolarAngleAxis textRendering="#FFFFFF" fill="#FFFFFF" stroke="#FFFFFF"  dataKey="status" />
          <PolarRadiusAxis textRendering="#FFFFFF" fill="#FFFFFF" stroke="#FFFFFF"  />
          <Radar name="status_issues" textRendering="#8884d8"  dataKey="n" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
      </ResponsiveContainer>
      
    );
})
