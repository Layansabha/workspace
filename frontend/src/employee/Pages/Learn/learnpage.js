import React from 'react'
import Sidebar from './Components/Sidebar/Sidebar'
import Courses from './Components/Courses/Courses2'
import AllStatus from './Components/AllStatus/AllStatus'
import STUDYSTATISTICS from './Components/STUDYSTATISTICS/STUDYSTATISTICS'
import Overview from './Components/Overview/Overview'
import Progress from './Components/Progress/Progress'
import LiveEvents from './Components/LiveEvents/LiveEvents'
import Assignments from './Assignments'

import './LearnPage.css'

function LearnPage() {
  return (

   <div className='main'>
 

 <div className='Courses2'><Courses/></div>
 <div className='AllStatus'><AllStatus/></div>
 <div className='STUDYSTATISTICS'><STUDYSTATISTICS/></div>
 <div className='Overview'><Overview/></div>
 <div className='Progress'><Progress/></div>
 <div className='LiveEvents'><LiveEvents/></div>
 <div className='Assignments'><Assignments/></div>

   </div>
  )
}

export default LearnPage