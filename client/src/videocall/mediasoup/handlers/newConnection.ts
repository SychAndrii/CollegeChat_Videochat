import NewConnectionDTO from "./contracts/NewConnectionDTO";

export default async function newConnection(dto: NewConnectionDTO) {
    console.log(`New connection: ${dto}`);
}