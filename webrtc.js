async function webRtcTest(testName, testId, twoWay, replacement) {

  createRow(testName, testId);

  const info = logInfo.bind(null, testId);
  const error = logError.bind(null, testId);

  const creatorPc = new RTCPeerConnection();

  async function createOffer() {

    creatorPc.oniceconnectionstatechange = function (e) {
      const iceState = creatorPc.iceConnectionState
      info("Creator state:", iceState);
      document.getElementById(testId + "-creator").innerText = iceState;
    }

    creatorPc.onicecandidateerror = function (e) {
      error("Creator onicecandidateerror", e);
    }

    const dc = creatorPc.createDataChannel("");
    dc.onopen = function (e) {
      info("Creator data channel opened");
    }
    dc.onerror = function (e) {
      error("Creator data channel onerror", e);
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
      info("Joiner state:", iceState);
      document.getElementById(testId + "-joiner").innerText = iceState;
    }

    joinerPc.onicecandidateerror = function (e) {
      error("Joiner onicecandidateerror", e);
    }

    joinerPc.ondatachannel = function (e) {
      const dc = e.channel;
      dc.onopen = function (e) {
        info("Joiner data channel opened");
      }
      dc.onerror = function (e) {
        error("Joiner data channel onerror", e);
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
    let offer = await createOffer();
    info("original offer:", offer);
    if (replacement) {
      offer = replaceCandidateHostnamesWith(offer, replacement);
      info("modified offer:", offer);
    }
    const answer = await createAnswer(offer);
    info("answer:", answer);
    if (twoWay) {
      await creatorPc.setRemoteDescription(answer);
    }
  } catch (e) {
    error("something went wrong:", e);
  }

}

webRtcTest("normal 1 way","n1w", false, "");
webRtcTest("normal 2 way","n2w", true, "");
webRtcTest("127.0.0.1 1 way","l4-1w", false, "127.0.0.1");
webRtcTest("127.0.0.1 2 way","l4-2w", true,"127.0.0.1");
webRtcTest("::1 1 way","l6-1w", false, "::1");
webRtcTest("::1 2 way","l6-2w", true, "::1");
