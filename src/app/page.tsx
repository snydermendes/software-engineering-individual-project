'use client'
import React from 'react'
import { Model } from '../model'
import styles from "./page.module.css";

export default function Home() {
  const [model, setModel] = React.useState(new Model())
  const [redraw, setRedraw] = React.useState(0)

  // Controllers
  const addVisitor = () => {
    const reason = document.getElementById("reason") as HTMLInputElement
    reason.value = reason.value.trim()
    if (reason.value === "") {
      console.log("Reason must be at least 1 character")
      return
    }
    model.addVisitor(reason.value)
    reason.value = ""
    setRedraw(redraw+1)
  }

  const addClerk = () => {
    const name = document.getElementById("clerkName") as HTMLInputElement
    name.value = name.value.trim()
    if (name.value === "") {
      console.log("Name must be at least 1 character")
      return
    }
    model.addClerk(name.value)
    name.value = ""
    setRedraw(redraw+1)
  }

  const removeOrClearClerk = (name: string) => {
    for (const c of model.clerks) {
      if (c.name === name) {
        if (c.removeOrClear === "Clear") {
          model.clearClerk(name)
        } else {
          model.removeClerk(name)
        }
      }
    }
    setRedraw(redraw+1)
  }

  const assignVisitor = () => {
    const vId = document.getElementById("vId") as HTMLInputElement
    vId.value = vId.value.trim()
    const cName = document.getElementById("cName") as HTMLInputElement
    cName.value = cName.value.trim().toUpperCase()
    if (vId.value === "") {
      console.log("Visitor Id is empty")
      return
    } else if (cName.value === "") {
      console.log("Clerk Name is empty")
      return
    }
    model.assignVisitor(Number(vId.value),cName.value)
    vId.value = ""
    cName.value = ""
    setRedraw(redraw+1);
  }

  // Boundary
  return (
  <main className={styles.main}>
    <h1 className={styles.title}>Welcome to the DMV</h1>
    <div className={styles.columns}>
      <div className={styles.section}>
        <b>Visitor Reason: </b><input id="reason" type="text"/>
        <button className={styles.button} onClick={() => addVisitor()}><b>Add Visitor</b></button>

        <h2 className={styles.gap}>Waiting Area</h2>
        {
          model.waitingVisitors.map(v => (
            <p key={v.id}>
              <b>Visitor #{v.id}</b>: {v.reasonForVisit} ({v.arrivalTime})
            </p>
          ))
        }
      </div>
      <div className={styles.section}>
        <b>Add Clerk: </b><input id="clerkName" type="text"/>
        <button className={styles.button} onClick={() => addClerk()}><b>Add Clerk</b></button>

        <h2 className={styles.gap}>Clerks</h2>
        {
          model.clerks.map(c => (
            <div key={c.name}>
              <b>{c.name}</b>
              <div>Current Visitor: {c.currentVisitor ? `#${c.currentVisitor.id}` : "None"}
                <button className={styles.button} onClick={() => removeOrClearClerk(c.name)}><b>{c.removeOrClear} Clerk</b></button>
              </div>
              <div className={styles.gap}>Visitors Helped: {c.visitorsHelped}</div>
            </div>
          ))
        }
      </div>
      <div className={styles.section}>
        <h2 className={styles.gap}>Assign a Clerk</h2>
        <div className={styles.gap}>
          <b>Visitor ID: </b><input id="vId" type="text"/>
        </div>
        <div className={styles.gap}>
          <b>Clerk Name: </b><input id="cName" type="text"/>
        </div>
        <div>
          <button className={styles.noMarginButton} onClick={() => assignVisitor()}><b>Assign</b></button>
        </div>
      </div>
    </div>
  </main>
  )
}
