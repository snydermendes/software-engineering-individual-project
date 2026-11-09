import React from 'react'
import { afterEach, expect, test } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import Home from './app/page'

// Helpers
function getInput(testId: string) {
  return screen.getByTestId(testId) as HTMLInputElement
}

function setInput(testId: string, value: string) {
  getInput(testId).value = value
}

function addVisitor(reason: string) {
  setInput("reason", reason)
  fireEvent.click(screen.getByTestId("addVisitor"))
}

function addClerk(name: string) {
  setInput("clerkName", name)
  fireEvent.click(screen.getByTestId("addClerk"))
}

function assign(visitorId: string, clerkName: string) {
  setInput("vId", visitorId)
  setInput("cName", clerkName)
  fireEvent.click(screen.getByTestId("assignVisitor"))
}

// The remove/clear button's test id is the clerk's stored (uppercase) name
function clerkButton(storedName: string) {
  return screen.getByTestId(storedName)
}

test('Add Visitor shows the visitor and clears the text box', () => {
  render(<Home />)

  addVisitor("Renew license")

  expect(screen.getByText("Visitor #1")).toBeDefined()
  expect(screen.getByText(/Renew license/)).toBeDefined()
  expect(getInput("reason").value).toBe("")
})

test('Add Visitor ignores an empty reason', () => {
  render(<Home />)

  addVisitor("   ")

  expect(screen.queryByText("Visitor #1")).toBeNull()
})

test('Visitor IDs increase with each visitor', () => {
  render(<Home />)

  addVisitor("First")
  addVisitor("Second")

  expect(screen.getByText("Visitor #1")).toBeDefined()
  expect(screen.getByText("Visitor #2")).toBeDefined()
})

test('Add Clerk shows the clerk and rejects duplicate names', () => {
  render(<Home />)

  addClerk("Dokja")
  expect(screen.getByText("DOKJA")).toBeDefined()
  expect(screen.getByText("Current Visitor: None")).toBeDefined()
  expect(screen.getByText("Visitors Helped: 0")).toBeDefined()
  expect(getInput("clerkName").value).toBe("")

  addClerk("dokja")   // same name, different case
  expect(screen.getAllByText("DOKJA").length).toBe(1)
})

test('Add Clerk ignores an empty name', () => {
  render(<Home />)

  addClerk("   ")

  expect(screen.queryByText("Visitors Helped: 0")).toBeNull()
})

test('Assign, Clear, and Remove a clerk', () => {
  render(<Home />)

  addVisitor("Renew license")
  addClerk("Dokja")
  expect(clerkButton("DOKJA").textContent).toBe("Remove Clerk")

  // assign visitor 1 to Dokja
  assign("1", "dokja")
  expect(screen.queryByText("Visitor #1")).toBeNull()
  expect(screen.getByText("Current Visitor: #1")).toBeDefined()
  expect(clerkButton("DOKJA").textContent).toBe("Clear Clerk")

  // clear the clerk
  fireEvent.click(clerkButton("DOKJA"))
  expect(screen.getByText("Current Visitor: None")).toBeDefined()
  expect(screen.getByText("Visitors Helped: 1")).toBeDefined()
  expect(clerkButton("DOKJA").textContent).toBe("Remove Clerk")

  // remove the clerk
  fireEvent.click(clerkButton("DOKJA"))
  expect(screen.queryByText("DOKJA")).toBeNull()
  expect(screen.queryByTestId("DOKJA")).toBeNull()
})

test('Assign with a bad visitor ID or clerk name changes nothing', () => {
  render(<Home />)

  addVisitor("Renew license")
  addClerk("Dokja")

  assign("99", "Dokja")
  assign("1", "Sooyoung")
  assign("abc", "Dokja")

  expect(screen.getByText("Visitor #1")).toBeDefined()
  expect(screen.getByText("Current Visitor: None")).toBeDefined()
})

test('Assign ignores empty fields', () => {
  render(<Home />)

  addVisitor("Renew license")
  addClerk("Dokja")

  assign("", "Dokja")
  assign("1", "")

  expect(screen.getByText("Visitor #1")).toBeDefined()
  expect(screen.getByText("Current Visitor: None")).toBeDefined()
})

test('A busy clerk cannot be given a second visitor', () => {
  render(<Home />)

  addVisitor("First")
  addVisitor("Second")
  addClerk("Dokja")

  assign("1", "Dokja")
  assign("2", "Dokja")

  expect(screen.getByText("Current Visitor: #1")).toBeDefined()
  expect(screen.getByText("Visitor #2")).toBeDefined()
})

test('Each clerk gets their own Remove/Clear button', () => {
  render(<Home />)

  addVisitor("Renew license")
  addClerk("Dokja")
  addClerk("Sooyoung")
  assign("1", "Dokja")

  expect(clerkButton("DOKJA").textContent).toBe("Clear Clerk")
  expect(clerkButton("SOOYOUNG").textContent).toBe("Remove Clerk")

  // removing the free clerk leaves the busy one alone
  fireEvent.click(clerkButton("SOOYOUNG"))
  expect(screen.queryByTestId("SOOYOUNG")).toBeNull()
  expect(clerkButton("DOKJA")).toBeDefined()
})