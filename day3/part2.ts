
import { claims } from './input.json';
import { Claim } from './claim';

function findNonCollidingClaims(claims: Claim[]) {
    let collided = [];
    claims.forEach((claim) => {
        collided.push(...claims.filter((c) => c != claim).filter((c) => doCollide(claim, c)).map((c) => c));
    })
    return claims.find((c) => !collided.includes(c));
}

function doCollide(claimA: Claim, claimB: Claim) {
    return (claimA.x < claimB.x + claimB.width &&
        claimA.x + claimA.width > claimB.x &&
        claimA.y < claimB.y + claimB.height &&
        claimA.height + claimA.y > claimB.y);
}

const parsedClaims = (claims as string[]).map(Claim.fromInputString);

const nonColliding = findNonCollidingClaims(parsedClaims);
console.log(`Solution ${nonColliding.id}`);
