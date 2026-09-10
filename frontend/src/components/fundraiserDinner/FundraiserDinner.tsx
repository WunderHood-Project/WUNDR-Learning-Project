import DinnerHero from "./DinnerHero";
import EventDetails from "./EventDetails";
import TicketOptions from "./TicketOptions";
import FundraisingGoal from "./FundraisingGoal";
import StudentProject from "./StudentProject";
import CantAttend from "./CantAttend";

export default function FundraiserDinner() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-wonderbg via-white to-wondersun/20">
            <DinnerHero />
            <EventDetails />
            <TicketOptions />
            <FundraisingGoal />
            <StudentProject />
            <CantAttend />
        </div>
    );
}
