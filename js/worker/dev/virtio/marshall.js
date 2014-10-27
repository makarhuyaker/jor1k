// -------------------------------------------------
// ------------------ Marshall ---------------------
// -------------------------------------------------
// helper functions for virtio and 9p.


// Inserts data from an array to a byte aligned struct in memory
function Marshall(typelist, input, struct, offset) {
    var item;
    var size = 0;
    for (var i=0; i < typelist.length; i++) {
        item = input[i];
        switch (typelist[i]) {
            case "w":
                struct[offset++] = item & 0xFF;
                struct[offset++] = (item >> 8) & 0xFF;
                struct[offset++] = (item >> 16) & 0xFF;
                struct[offset++] = (item >> 24) & 0xFF;
                size += 4;
                break;
            case "d": // double word
                struct[offset++] = item & 0xFF;
                struct[offset++] = (item >> 8) & 0xFF;
                struct[offset++] = (item >> 16) & 0xFF;
                struct[offset++] = (item >> 24) & 0xFF;
                struct[offset++] = 0x0;
                struct[offset++] = 0x0;
                struct[offset++] = 0x0;
                struct[offset++] = 0x0;
                size += 8;
                break;
            case "h":
                struct[offset++] = item & 0xFF;
                struct[offset++] = item >> 8;
                size += 2;
                break;
            case "b":
                struct[offset++] = item;
                size += 1;
                break;
            case "s":
                struct[offset++] = item.length & 0xFF;
                struct[offset++] = (item.length >> 8) & 0xFF;
                size += 2;
                for (var j in item) {
                    var c = item.charCodeAt(j);
                    if ((c < 32) || (c > 127)) {
                        DebugMessage("Warning in Marshall: Unusual character detected");
                    }
                    struct[offset++] = c;
                    size += 1;
                }
                break;
            case "Q":
                Marshall(["b", "w", "d"], [item.type, item.version, item.path], struct, offset)
                offset += 13;
                size += 13;
                break;
            default:
                DebugMessage("Marshall: Unknown type=" + type[i]);
                break;
        }
    }
    return size;
};


// Extracts data from a byte aligned struct in memory to an array
function Unmarshall(typelist, struct, offset) {
    var output = [];
    for (var i=0; i < typelist.length; i++) {
        switch (typelist[i]) {
            case "w":
                var val = struct[offset++];
                val += struct[offset++] << 8;
                val += struct[offset++] << 16;
                val += (struct[offset++] << 24) >>> 0;
                output.push(val);
                break;
            case "d":
                var val = struct[offset++];
                val += struct[offset++] << 8;
                val += struct[offset++] << 16;
                val += (struct[offset++] << 24) >>> 0;
                offset += 4;
                output.push(val);
                break;
            case "h":
                var val = struct[offset++];
                output.push(val + (struct[offset++] << 8));
                break;
            case "b":
                output.push(struct[offset++]);
                break;
            case "s":
                var len = struct[offset++];
                len += struct[offset++] << 8;
                var str = '';
                for (var j=0; j < len; j++) {
                    var c = struct[offset++];
                    if ((c < 32) || (c > 127)) {
                        DebugMessage("Warning in Unmarshall: Unusual character detected");
                    }
                    str += String.fromCharCode(c);
                }
                output.push(str);
                break;
            default:
                DebugMessage("Error in Unmarshall: Unknown type=" + typelist[i]);
                break;
        }
    }
    return output;
};


// Extracts data from a byte aligned struct in memory to an array
function Unmarshall2(typelist, GetByte) {
    var output = [];
    for (var i=0; i < typelist.length; i++) {
        switch (typelist[i]) {
            case "w":
                var val = GetByte();
                val += GetByte() << 8;
                val += GetByte() << 16;
                val += (GetByte() << 24) >>> 0;
                output.push(val);
                break;
            case "d":
                var val = GetByte();
                val += GetByte() << 8;
                val += GetByte() << 16;
                val += (GetByte() << 24) >>> 0;
                GetByte();GetByte();GetByte();GetByte();
                output.push(val);
                break;
            case "h":
                var val = GetByte();
                output.push(val + (GetByte() << 8));
                break;
            case "b":
                output.push(GetByte());
                break;
            case "s":
                var len = GetByte();
                len += GetByte() << 8;
                var str = '';
                for (var j=0; j < len; j++) {
                    var c = GetByte();
                    if ((c < 32) || (c > 127)) {
                        DebugMessage("Warning in Unmarshall2: Unusual character detected");
                    }
                    str += String.fromCharCode(c);
                }
                output.push(str);
                break;
            default:
                DebugMessage("Error in Unmarshall2: Unknown type=" + typelist[i]);
                break;
        }
    }
    return output;
};

