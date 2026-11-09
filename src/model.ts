export class Visitor {
    readonly id: number;
    readonly reasonForVisit: string;
    readonly arrivalTime: string;

    constructor(id: number, reasonForVisit: string, arrivalTime: Date) {
        this.id = id;
        this.reasonForVisit = reasonForVisit;
        this.arrivalTime = arrivalTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false});
    }
}

export class Clerk {
    readonly name: string;
    currentVisitor: Visitor | undefined = undefined;
    visitorsHelped: number = 0;

    constructor(name: string) {
        this.name = name;
    }

    isAvailable(): boolean {
        return this.currentVisitor === undefined;
    }

    // returns true if the assignment worked
    // returns false else
    assign(visitor: Visitor) : boolean {
        if (!this.isAvailable()) return false; // If busy, return false
        this.currentVisitor = visitor;
        return true;
    }

    clear() : void {
        if (this.currentVisitor === undefined) return;
        this.currentVisitor = undefined;
        this.visitorsHelped++;
    }
}

export class Model {
    waitingVisitors: Visitor[] = [];
    clerks: Clerk[] = [];
    nextVisitorId: number = 1;

    addVisitor(reason: string) : void {
        const date = new Date();
        const newVisitor = new Visitor(this.nextVisitorId, reason, date);
        this.waitingVisitors.push(newVisitor);
        this.nextVisitorId++;
    }

    addClerk(name: string): boolean {
        name = name.toUpperCase(); // Normalizes names to uppercase
        for (let i = 0; i < this.clerks.length; i++) {
            if (name === this.clerks[i].name) return false;
        }
        const newClerk = new Clerk(name);
        this.clerks.push(newClerk);
        return true;
    }

    removeClerk(clerkName: string) : boolean {
        clerkName = clerkName.toUpperCase();
        for (let i = 0; i < this.clerks.length; i++) {
            if (this.clerks[i].name === clerkName) {
                if (!this.clerks[i].isAvailable()) return false; // Can't remove a busy clerk
                this.clerks.splice(i, 1);
                return true; // clerk found
            }
        }
        return false; // clerk not found
    }

    assignVisitor(visitorId: number, clerkName: string) : boolean {
        clerkName = clerkName.toUpperCase();
        let clerk;
        let vIndex: number = -1; //Should be replaced by the time the assign function is called
        const vLength = this.waitingVisitors.length;
        const cLength = this.clerks.length;
        if (vLength === 0 || cLength === 0) return false; // If either clerks list or waitingVisitors list is empty, return false
        for (let i = 0; i < vLength; i++) {
            if (this.waitingVisitors[i].id === visitorId) {
                vIndex = i;
                break;
            }
            if (i === (vLength-1)) {
                return false;
            }
        }

        for (let i = 0; i < cLength; i++) {
            if (this.clerks[i].name === clerkName) {
                clerk = this.clerks[i];
                if (!clerk.isAvailable()) {
                    return false;
                }
                break;
            }
            if (i === (cLength-1)) {
                return false;
            }
        }
        
        // Reaching here means the clerk and visitor where both found
        //  and the clerk is not busy
        if (!clerk?.assign(this.waitingVisitors[vIndex])) return false; //Should be unreachable
        this.waitingVisitors.splice(vIndex, 1);
        return true;
    }

    clearClerk(name: string) : boolean {
        name = name.toUpperCase();
        for (let i = 0; i < this.clerks.length; i++) {
            if (name === this.clerks[i].name) {
                if (this.clerks[i].isAvailable()) return false; // Can't clear an available clerk
                this.clerks[i].clear();
                return true;
            }
        }
        return false;
    }
}