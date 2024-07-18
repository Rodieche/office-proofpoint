export const checkProofpoint = (email, proofpointList) => {
    const proof = proofpointList.filter(r => r.title == email)[0];
    if(!proof) return 'Not in proofpoint';
    return proof.type;
}