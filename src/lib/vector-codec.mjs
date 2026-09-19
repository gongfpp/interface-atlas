/**
 * Embedding 向量编解码：JSON 浮点数组体积约为 Float32 二进制的 5 倍，
 * 索引中的向量改为 base64(float32 little-endian) 存储，浏览器与 Node 共用。
 */

/** @param {number[][]} vectors */
export function encodeVectors(vectors) {
  const count = vectors.length;
  const dim = vectors[0]?.length ?? 0;
  const flat = new Float32Array(count * dim);
  for (let i = 0; i < count; i++) flat.set(vectors[i], i * dim);
  return { count, dim, data: globalThis.Buffer.from(flat.buffer).toString('base64') };
}

/**
 * @param {{count:number, dim:number, data:string}} payload
 * @returns {number[][]}
 */
export function decodeVectors({ count, dim, data }) {
  const bytes =
    typeof globalThis.Buffer !== 'undefined'
      ? globalThis.Buffer.from(data, 'base64')
      : Uint8Array.from(globalThis.atob(data), (c) => c.charCodeAt(0));
  const ab = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
  const flat = new Float32Array(ab);
  const vectors = [];
  for (let i = 0; i < count; i++) vectors.push(Array.from(flat.subarray(i * dim, (i + 1) * dim)));
  return vectors;
}
