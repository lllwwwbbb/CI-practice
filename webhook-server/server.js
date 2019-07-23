var http = require('http');
var moment = require('moment');
var spawn = require('child_process').spawn;
var spawnSync = require('child_process').spawnSync;
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

function runCommand (cmd_with_args){
  vec = cmd_with_args.split(' ')
  console.log('[RUN COMMAND] ' + cmd_with_args)
  spawnSync(vec[0], vec.slice(1), { stdio: [0, 1, 1] })
}

// 监听到push事件的时候执行我们的自动化脚本
handler.on('push', function (event) {
  console.log('-----------------------------'); 
  console.log('[TIME] ' + moment().format());
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);
  runCommand('sh ./on_push.sh')
  runCommand('pm2 start server')
});

