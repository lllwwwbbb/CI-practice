var http = require('http');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec
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
    var child = spawn( cmd, args );
    var resp = '';
    child.stdout.on('data', function( buffer ){ resp += buffer.toString(); });
    child.stderr.on('data', function( buffer ){ resp += buffer.toString(); });
    child.on('exit', function( code ){ callback( resp ) });
}
// 监听到push事件的时候执行我们的自动化脚本
handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
  exec('sh ./auto_build.sh', {}, function(err, stdout, stderr) {
    if (err) console.log(err)
    console.log(stdout)
    console.log(stderr)
  })
  //runCommand('sh', ['./auto_build.sh'], function(resp) {
  //  console.log(resp)
  //});
  //runCommand('sh', ['./auto_build.sh'], console.log) 
});

