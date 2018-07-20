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
		</div>
		`,
		remove(){
			$('body').find('.new-playlist-dialog').remove()
		}
	}

	let model = {
		data:{},
		new(){
			var Playlist = AV.Object.extend('Playlist');
			var playlist = new Playlist();
			playlist.set('name',this.data.name);
			playlist.set('cover', this.data.cover);
			return playlist.save().then((result) => {
			  	return result;
			});
		}
	}

	let controller = {
		init(view, model){
			this.view = view
			this.model = model
			this.bindEvents()
			this.validateForm()
		},
		bindEvents(){
			$(this.view.el).on('click', (e) => {
				$('body').append(this.view.template)
			})

			$('body').on('click', '#createPlaylist',(e) => {
				let isValidate = Boolean($('body').find('.validate-tips').text())
				if(!isValidate){ // 验证是否通过
					let valueList = ['name', 'cover']
					valueList.map((key) => {
						this.model.data[key] = $('.new-playlist-dialog').find(`input[name=${key}]`).val()
					})
					this.model.new().then((result) => {
						window.eventHub.emit('newPlaylist', this.model.data)
						this.view.remove()
					})
				}
			})

			$(this.view.el).on('click', '#canclePlaylist', (e) => {
				this.view.remove()
			})
		},
		validateForm(){
			$(this.view.el).find('#playlistName').on('blur', (e) => {
				let value = $(e.currentTarget).val()
				if(!value){
					$(e.currentTarget).parent().siblings('.validate-tips').text('请输入歌单名')
				}else{
					$(e.currentTarget).parent().siblings('.validate-tips').text('')
				}
			})

			$(this.view.el).find('#playlistCover').on('blur', (e) => {
				let value = $(e.currentTarget).val()
				if(!value){
					$(e.currentTarget).parent().siblings('.validate-tips').text('请输入歌单封面链接')
				}else{
					$(e.currentTarget).parent().siblings('.validate-tips').text('')
				}
			})
		}
	}

	controller.init(view, model)
}