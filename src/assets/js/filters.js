export function formatbytes(bytes) {
  if(!bytes) return bytes
  if (bytes === 0) return '0 B'
  let k = 1024 // or 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = Math.floor(Math.log(bytes) / Math.log(k))
  console.log(i)
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i + 1]
}
