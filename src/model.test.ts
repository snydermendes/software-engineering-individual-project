import { expect, test } from 'vitest'
import { Visitor, Clerk, Model } from './model.ts'

test('Visitor', () => {
    let date = new Date(2026, 10, 9, 18, 0)
    let v1 = new Visitor(1, "xyz", date)

    expect(v1.id).toBe(1)
    expect(v1.reasonForVisit).toBe("xyz")
    expect(v1.arrivalTime).toBe("18:00")
})

test('Clerk', () => {
    let c1 = new Clerk("Dokja")
    let date = new Date(2026, 10, 9, 18, 0)
    let v2 = new Visitor(1, "xyz", date) 

    expect(c1.name).toBe("Dokja")
    expect(c1.currentVisitor).toBe(undefined)
    expect(c1.visitorsHelped).toBe(0)
    expect(c1.isAvailable()).toBe(true)
    expect(c1.assign(v2)).toBe(true)
    expect(c1.currentVisitor).toBe(v2)
    expect(c1.isAvailable()).toBe(false)
    expect(c1.assign(v2)).toBe(false)
    c1.clear()
    expect(c1.currentVisitor).toBe(undefined)
    expect(c1.isAvailable()).toBe(true)
    expect(c1.visitorsHelped).toBe(1)
})

test('Model', () => {
    let model = new Model()

    expect(model.waitingVisitors.length).toBe(0)
    expect(model.clerks.length).toBe(0)
    expect(model.nextVisitorId).toBe(1)
    expect(model.assignVisitor(1, "Dokja")).toBe(false) // Both clerks and waitingVisitors are empty
    // Add visitor with reason "xyz"
    model.addVisitor("xyz")
    expect(model.waitingVisitors.length).toBe(1)
    expect(model.nextVisitorId).toBe(2)
    expect(model.assignVisitor(1, "Dokja")).toBe(false) // Clerks is empty
    // Add clerk with name "Dokja"
    expect(model.addClerk("dokja")).toBe(true)
    expect(model.addClerk("DoKja")).toBe(false) // Already added dispite different case
    expect(model.clerks.length).toBe(1)
    // Assign clerk "Dokja" to visitor 1 with reason "xyz"
    expect(model.assignVisitor(2, "Dokja")).toBe(false) // wrong visitor id
    expect(model.assignVisitor(1, "Sooyoung")).toBe(false) // wrong clerk name
    expect(model.assignVisitor(1, "Dokja")).toBe(true) // Correct cName and vId
    expect(model.waitingVisitors.length).toBe(0) // Visitor isn't waiting anymore
    expect(model.clerks[0].isAvailable()).toBe(false) // Check if clerk is busy after assignment
    expect(model.clerks[0].currentVisitor?.id).toBe(1) // Check if the assigned visitor is the right one
    model.addVisitor("abc")
    expect(model.assignVisitor(2, "Dokja")).toBe(false) // Clerk "Dokja" is busy
    // Clear Clerk "Dokja"
    expect(model.removeClerk("Dokja")).toBe(false) // Can't remove a busy clerk
    expect(model.clearClerk("Dokja")).toBe(true) // Cleared Clerk "Dokja"
    expect(model.clerks[0].currentVisitor).toBe(undefined)
    expect(model.clerks[0].visitorsHelped).toBe(1)
    expect(model.clearClerk("Dokja")).toBe(false) // Can't clear an available clerk
    expect(model.clearClerk("Yu")).toBe(false) // Can't clear a clerk that doesn't exist
    expect(model.removeClerk("Sooyoung")).toBe(false) // Can't remove a clerk that doesn't exist
    expect(model.removeClerk("Dokja")).toBe(true) // Removed Clerk "Dokja"
    expect(model.clerks.length).toBe(0)
})