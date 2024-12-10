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