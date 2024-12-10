function replaceCandidateHostnamesWith(sdpObject, replacement) {
  const modifiedSdp = sdpObject.sdp.split('\n').map(line => {
    if (line.startsWith('a=candidate')) {
      const parts = line.split(' ');
      if (parts.length > 4) {
        parts[4] = replacement;
      }
      return parts.join(' ');
    }
    return line;
  }).join('\n');

  return {type: sdpObject.type, sdp: modifiedSdp};
}

function replaceCandidateAddressesCrossMultiplied(sdpObject, newAddresses) {
  const originalSdpLines = sdpObject.sdp.split('\n');
  const newSdpLines = [];

  for (const line of originalSdpLines) {
    if (line.startsWith('a=candidate')) {
      const parts = line.split(' ');
      if (parts.length <= 4) {
        continue;
      }
      // for each new address we create a new candidate line and replace the existing address
      for (const addr of newAddresses) {
        parts[4] = addr;
        newSdpLines.push(parts.join(' '));
      }
    } else {
      newSdpLines.push(line);
    }
  }

  return {type: sdpObject.type, sdp: newSdpLines.join('\n')}
}

async function findLocalAddresses() {
  const rtc = new RTCPeerConnection();
  const dc = rtc.createDataChannel('');
  await rtc.setLocalDescription();

  await new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => reject(new Error("timeout while finding local addresses")), 2000);
    rtc.onicecandidate = (e) => {
      if (e.candidate === null) {
        // all candidates have been gathered
        clearTimeout(timeoutId);
        resolve();
      }
    };
  });

  const localAddresses = extractDistinctCandidateAddresses(rtc.localDescription?.sdp ?? "");
  dc.close();
  rtc.close();
  return localAddresses;
}

function extractDistinctCandidateAddresses(sdp) {
  const hosts = new Set();
  sdp.split('\r\n').forEach(function (line) { // http://tools.ietf.org/html/rfc4566#page-39 - CRLF
    if (line.includes("a=candidate")) { // http://tools.ietf.org/html/rfc4566#section-5.13
      const parts = line.split(' '); // http://tools.ietf.org/html/rfc5245#section-15.1 - "SP" in the rfc document means one space character
      const addr = parts[4];
      const type = parts[7];
      if (type === 'host') {
        hosts.add(addr)
      }
    }
  });
  return hosts;
}
