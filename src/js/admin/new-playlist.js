{
	let view = {
		el: '#newPlaylist',
		template:`
		<div class="dialog-container new-playlist-dialog">
			<div class="dialog-inner">
				<h1 class="dialog-title">新建歌单</h1>
			    <div class="dialog-content">
			    	<form>
			    		<div class="row">
			    			<div class="input-row">
			    			    <label for="name">歌单名</label>
			    		        <input id="playlistName" type="text" name="name" placeholder="请输入歌单名">
			    			</div>
			    			<p class="validate-tips"></p>
			    		</div>
			    		<div class="row">
			    			<div class="input-row">
			    			    <label for="cover">封面</label>
			    		        <input id="playlistCover" type="text" name="cover" placeholder="请输入封面链接">
			    			</div>
			    			<p class="validate-tips"></p>
			    		</div>
			    	</form>
			    </div>
			    <div class="dialog-footer">
			    	<button id="createPlaylist" class="operator-button primary">创建</button>
			    	<button id="canclePlaylist" class="operator-button danger">取消</button>
			    </div>
			</div>
			<script src="./src/js/admin/new-playlist-button.js"></script>
		</div>
		`
	}

	let model = {}

	let controller = {
		init(view, model){
			this.view = view
			this.model = model
			this.bindEvents()
		},
		bindEvents(){
			$(this.view.el).on('click', (e) => {
				$('body').append(this.view.template)
			})
		}
	}

	controller.init(view, model)
}