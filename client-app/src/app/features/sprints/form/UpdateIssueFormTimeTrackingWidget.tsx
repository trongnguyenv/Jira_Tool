
import { TrackingWidget, WatchIcon, Right, BarCont, Bar, Values } from './Styles';
import { Issue } from '../../../models/issue';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../stores/store';

function convertTimespanToMinutes(timespan: string) {
  if(timespan == "00:00:00"){
    return 0
  }
  console.log("Timespan received =");
  console.log(timespan);
    var days = parseInt(timespan.substring(0, timespan.indexOf('.')));
    var days_to_minutes = 0;
    console.log("Days = ");
    
    if(days > 0){
        days_to_minutes = ((days * 24) * 60);
        console.log("Days to minutes =");
        console.log(days_to_minutes);
    }

    var hours = parseInt(timespan.substring(timespan.indexOf('.') + 1, timespan.indexOf(':')));
    var hours_to_minutes = 0;

    if(hours > 0){
        hours_to_minutes = hours * 60
        console.log("Hours to minutes");
        console.log(hours_to_minutes);
    }

    var timespan_minus_days_and_hours = timespan.substring(timespan.indexOf(':') + 1, timespan.length);
    
    var minutes = parseInt(timespan_minus_days_and_hours.substring(0, timespan_minus_days_and_hours.indexOf(":")));
   
    var total_minutes = days_to_minutes + hours_to_minutes + minutes;
    console.log("Total minutes =");
    console.log(total_minutes);
    
    return(total_minutes);
}

function calculateTrackingBarWidth(time_logged: string, time_remaining: string, original_estimate: string) {
    var minutes_logged = convertTimespanToMinutes(time_logged);
    console.log("Minutes logged =");
    console.log(minutes_logged);
    var minutes_remaining = convertTimespanToMinutes(time_remaining);
    console.log("Minutes remaining =");
    console.log(minutes_remaining);
    var minutes_original_estimate = convertTimespanToMinutes(original_estimate);
    console.log("Original estimate in minutes =");
    console.log(minutes_original_estimate);
    
    if (minutes_logged === 0 && minutes_remaining === 0) {
        console.log("Returning first case");
      return '100';
    }
    if (minutes_remaining !== 0) {
        console.log("Returning second case =");
        console.log(Math.round((minutes_logged / (minutes_logged + minutes_remaining)) * 100));
      return Math.round((minutes_logged / (minutes_logged + minutes_remaining)) * 100).toString();
    }
    if (minutes_original_estimate !== 0) {
        console.log("Returning third case =");
        console.log(Math.min((minutes_logged / minutes_original_estimate) * 100, 100));
      return Math.min((minutes_logged / minutes_original_estimate) * 100, 100).toString();
    }
}


function parseTimeSpan(timespan: string) {
    if(timespan == "00:00:00"){
      return '0 hours'
    }
    var days = timespan.substring(0, timespan.indexOf('.'));
    
    if(days === null || days === ''){days = '0';}
    var days_string = '';
    if(days === '001'){ days_string = 'day'; } else { days_string = 'days'}
    
    var hours = timespan.substring(timespan.indexOf('.') + 1, timespan.indexOf(':'));
    
    if(hours === null){ hours = '0'; }
    var hours_string = '';
    if(hours === '01'){ hours_string = 'hour' } else ( hours_string = 'hours' );

    
    var timespan_minus_days_and_hours = timespan.substring(timespan.indexOf(':') + 1, timespan.length);
    
    var minutes = timespan_minus_days_and_hours.substring(0, timespan_minus_days_and_hours.indexOf(":"));
    
    if(minutes === null){ minutes = '0'; }
    var minutes_string = '';
    if(minutes === '01') { minutes_string = 'minute'} else { minutes_string = 'minutes'}
    var time_span = '';

    if(days === '0' && hours === '0'){
        time_span = parseInt(minutes).toString().concat(' ', minutes_string);
    }
    else if(days === '0'){
        time_span = parseInt(hours).toString().concat(' ', hours_string, ' ', parseInt(minutes).toString(), ' ', minutes_string);
    }
    else { time_span = parseInt(days).toString().concat(' ', days_string, ' ', parseInt(hours).toString(), ' ', hours_string, ' ', parseInt(minutes).toString(), ' ', minutes_string);  }
    
    return(time_span);
}


export default observer(function UpdateIssueFormTrackingWidget(){

    var { issueStore } = useStore()

    return(
    <TrackingWidget>
      <WatchIcon type="stopwatch" size={26} top={-1} />
      <Right>
        <BarCont>
          <Bar width={calculateTrackingBarWidth(issueStore.selectedIssue!.time_logged, issueStore.selectedIssue!.time_remaining, issueStore.selectedIssue!.original_estimated_duration)!} />
        </BarCont>
        <Values>
          <div>{parseTimeSpan(issueStore.selectedIssue!.time_logged) ? `${parseTimeSpan(issueStore.selectedIssue!.time_logged)} logged` : 'No time logged'}</div>
          <div>{parseTimeSpan(issueStore.selectedIssue!.time_remaining) ? `${parseTimeSpan(issueStore.selectedIssue!.time_remaining)} remaining` : 'No time remaining'}</div>
          {/*renderRemainingOrEstimate(issue) */}
        </Values>
      </Right>
    </TrackingWidget>
    )
});