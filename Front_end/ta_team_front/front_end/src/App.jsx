import { useState } from 'react'
import Header from './components/Header'
import './index.css'
import RequirementForm from './components/RequirementForm'
import {Routes,Route} from 'react-router-dom'
import Submission from './components/Submissions'
import AllRequirements from './components/AllRequirements'
import OfferForm from './components/OfferForm'
import AllSubmissions from './components/AllSubmissions'
import SubmissionDatesForm from './components/SubmissonDatesForm'
function App() {

  return (
    <>
 <Header/>
<Routes>
  <Route path='/' element={<RequirementForm/>}/>
  <Route path='/submissions' element={<Submission/>}/>
   <Route path='/allreqs' element={<AllRequirements/>}/>
    <Route path='/filledjob' element={<OfferForm/>}/>
    <Route path='/allsubmissions' element={<AllSubmissions/>}/>
     <Route path='/submissionsDateEntry' element={<SubmissionDatesForm/>}/>
</Routes>

 </>
  )
}

export default App
