/** A stopped or hidden page cannot be restarted by a late AudioContext.resume(). */
export function createAtlasSynth(options: {
  volume: () => number;
  onState: (state: 'idle' | 'loading' | 'playing') => void;
  onError: () => void;
}) {
  let audio: AudioContext | undefined;
  let voices: OscillatorNode[] = [];
  let gain: GainNode | undefined;

  function stop() {
    const context = audio;
    audio = undefined;
    voices.forEach(voice => voice.stop());
    voices = [];
    gain = undefined;
    if (context && context.state !== 'closed') void context.close().catch(() => {});
    options.onState('idle');
  }

  async function toggle() {
    if (audio) { stop(); return; }
    let context: AudioContext | undefined;
    options.onState('loading');
    try {
      context = new AudioContext();
      audio = context;
      await context.resume();
      if (audio !== context) return;
      gain = context.createGain();
      gain.gain.value = options.volume() / 100 * .12;
      gain.connect(context.destination);
      for (const frequency of [130.81, 164.81, 196]) {
        const oscillator = context.createOscillator();
        oscillator.type = 'triangle';
        oscillator.frequency.value = frequency;
        oscillator.connect(gain);
        oscillator.start();
        voices.push(oscillator);
      }
      options.onState('playing');
    } catch {
      if (audio !== context) return;
      stop();
      options.onError();
    }
  }

  function updateVolume() {
    if (gain && audio) gain.gain.setTargetAtTime(options.volume() / 100 * .12, audio.currentTime, .03);
  }
  return { toggle, stop, updateVolume };
}
