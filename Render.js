function Render(canvas, scene)
{
	this.ctx = canvas.getContext('2d');
	this.scene = scene;
	this.camera = new Point(0, 0);
	this.savedCamera = null;
	this.time = (new Date).getTime();
	
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
}

Render.prototype.saveCamera = function()
{
	this.savedCamera = new Point(this.camera.x, this.camera.y);
}

Render.prototype.draw = function()
{
	var self = game.render;
	var ctx = self.ctx;
	var camera = self.camera;
	var dirtyIDs = game.scene.dirtyIDs;
	
	var now = (new Date).getTime();
	var dt = now - self.time;
	game.logic.update(dt);
	self.time = now;
	
	var savedCamera = self.savedCamera;
	var cameraForClear = savedCamera == null ? camera : savedCamera;
	
	ctx.save();
	ctx.translate(cameraForClear.x, cameraForClear.y);
	for (var i = 0; i < dirtyIDs.length; i++)
	{
		ctx.save();
		var object = game.scene.objects.get(dirtyIDs[i]);
		object.clear(ctx);
		ctx.restore();
	}
	ctx.restore();
	
	ctx.save();
	ctx.translate(camera.x, camera.y);
	for (var i = 0; i < dirtyIDs.length; i++)
	{
		var object = game.scene.objects.get(dirtyIDs[i]);
		ctx.save();
		object.draw(ctx);
		ctx.restore();
	}
	ctx.restore();
	
	dirtyIDs.splice(0, dirtyIDs.length);
	self.savedCamera = null;
	
	window.requestAnimationFrame(self.draw);
}