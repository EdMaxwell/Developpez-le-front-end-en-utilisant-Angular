// TODO: create here a typescript interface for an olympic country

import IParticipation from "./Participation";

export default interface IOlympicCountry {
  id: number,
  country: string,
  participations: IParticipation[]
}
