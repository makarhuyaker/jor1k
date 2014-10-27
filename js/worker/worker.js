// -------------------------------------------------
// -------------------- Worker ---------------------
// -------------------------------------------------

importScripts('messagehandler.js', 'utils.js', 'dev/framebuffer.js', 
    'dev/ethmac.js', 'dev/ata.js', 'dev/rtc.js',
    'dev/uart.js', 'dev/touchscreen.js', 'dev/keyboard.js', 
    'dev/sound.js', 'ram.js',
    'system.js', 'bzip2.js', 'cpu/cpu.js', 'cpu/fastcpu.js', 'cpu/safecpu.js',
    'dev/virtio/marshall.js', 'dev/virtio.js',
    'dev/virtio/9p.js', 'filesystem/filesystem.js', 'filesystem/tar.js');


var sys = new System(); // one global variable for the abort function
