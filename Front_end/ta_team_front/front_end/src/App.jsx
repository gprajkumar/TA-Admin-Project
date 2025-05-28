import { useState } from 'react'
import Header from './components/Header'
import './index.css'
import RequirementForm from './components/RequirementForm'
import {Routes,Route} from 'react-router-dom'
import Submission from './components/Submissions'
import AllRequirements from './components/AllRequirements'
function App() {

  return (
    <>
 <Header/>
<Routes>
  <Route path='/' element={<RequirementForm/>}/>
  <Route path='/submissions' element={<Submission/>}/>
   <Route path='/allreqs' element={<AllRequirements/>}/>
</Routes>

 </>
  )
}

export default App
