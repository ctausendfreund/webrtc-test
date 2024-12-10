async function webRtcTest() {

  const creatorPc = new RTCPeerConnection();

  async function createOffer() {

    creatorPc.oniceconnectionstatechange = function (e) {
      const iceState = creatorPc.iceConnectionState
      info("Creator state changed:", iceState);
    }

    creatorPc.onicecandidateerror = function (e) {
      error("Creator onicecandidateerror", e);
    }

    const dc = creatorPc.createDataChannel("");
    dc.onopen = function (e) {
      info("Creator data channel opened");
    }

    await creatorPc.setLocalDescription(); // creates the offer

    return await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error("timeout while creating the offer")), 2000);
      creatorPc.onicecandidate = (e) => {
        if (e.candidate === null) {
          // all candidates have been gathered
          clearTimeout(timeoutId);
          resolve(creatorPc.localDescription); // return the offer
        }
      };
    });
  }

  async function createAnswer(offer) {
    const joinerPc = new RTCPeerConnection();

    joinerPc.oniceconnectionstatechange = function (e) {
      const iceState = joinerPc.iceConnectionState
      info("Joiner state changed:", iceState);
    }

    joinerPc.onicecandidateerror = function (e) {
      error("Joiner onicecandidateerror", e);
    }

    joinerPc.ondatachannel = function (e) {
      e.channel.onopen = function (e) {
        info("Joiner data channel opened");
      }
    }

    await joinerPc.setRemoteDescription(offer);
    await joinerPc.setLocalDescription(); // this creates the answer and initiates the connection process

    return await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => reject(new Error("timeout while creating the answer")), 2000);
      joinerPc.onicecandidate = (e) => {
        if (e.candidate === null) {
          // all candidates have been gathered
          clearTimeout(timeoutId);
          resolve(joinerPc.localDescription); // return the answer
        }
      };
    });
  }

  try {
    const offer = await createOffer();
    info("offer:\n", offer);
    const answer = await createAnswer(offer);
    info("answer:", answer);
    await creatorPc.setRemoteDescription(answer);
  } catch (e) {
    error("something went wrong:", e);
  }

}

webRtcTest();
