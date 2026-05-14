import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Contacts from "./Contacts";
import Archive from "./Archive";
import Message from "./Message";
import Profile from "./Profile";
import Test from "./Test";
import Index from "./Index";


import NavBar from "../components/NavBar";

import "../styles/message.css";

export default function App() {

  /* begin export */
  return (
    <>
      <NavBar/>

      <Routes>
        <Route path="/" element={<Index/>}/>
        <Route path="/contacts" element={<Contacts/>}/>
        <Route path="/archive" element={<Archive/>}/>
        <Route path="/message" element={<Message/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/test" element={<Test/>}/>
      </Routes>

    </>
  );
}
