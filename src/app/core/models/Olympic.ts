import IParticipation from "./Participation";

export default interface IOlympicCountry {
  id: number,
  country: string,
  participations: IParticipation[]
}
