var http = require('http');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var execFile = require('child_process).execFile;
var createHandler = require('github-webhook-handler');

// 下面填写的myscrect跟github webhooks配置一样，下一步会说；path是我们访问的路径
var handler = createHandler({ path: '/webhook', secret: 'ci' });

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404;
    res.end('no such location');
  })
}).listen(6666);

handler.on('error', function (err) {
  console.error('Error:', err.message)
});

function runCommand( cmd, args, callback ){
    var child = spawn( cmd, args, { stdio: 'inherit' } );
    var resp = '';
    child.stdout.on('data', function( buffer ){ console.log(buffer.toString()) });
    child.stdout.on('close', function(){ callback( resp ) });
}
// 监听到push事件的时候执行我们的自动化脚本
handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
  spawn('sh', ['./on_push.sh'], { stdio: 'inherit' })
  spawn('pm2', ['reload', 'server'], { stdio: 'inherit' })
});

