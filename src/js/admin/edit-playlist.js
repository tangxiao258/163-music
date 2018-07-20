{
	let view = {
		el: '.playlist-operator',
		template:`
		<div class="dialog-container edit-playlist-dialog">
			<div class="dialog-inner">
				<h1 class="dialog-title">编辑歌单</h1>
			    <div class="dialog-content">
			    	<form>
			    	    <div class="row">
			    			<div class="input-row">
			    			    <label for="name">ID</label>
			    		        <input type="text" name="id" disabled placeholder="请输入歌单名" value="__id__">
			    			</div>
			    			<p class="validate-tips"></p>
			    		</div>
			    		<div class="row">
			    			<div class="input-row">
			    			    <label for="name">歌单名</label>
			    		        <input id="playlistName" type="text" name="name" placeholder="请输入歌单名" value="__name__">
			    			</div>
			    			<p class="validate-tips"></p>
			    		</div>
			    		<div class="row">
			    			<div class="input-row">
			    			    <label for="cover">封面</label>
			    		        <input id="playlistCover" type="text" name="cover" placeholder="请输入封面链接" value="__cover__">
			    			</div>
			    			<p class="validate-tips"></p>
			    		</div>
			    	</form>
			    </div>
			    <div class="dialog-footer">
			    	<button id="savePlaylist" class="operator-button primary">保存</button>
			    	<button id="canclePlaylist" class="operator-button danger">取消</button>
			    </div>
			</div>
		</div>
		`,
		render(data){
			let html = this.template
			for(let key in data){
				html = html.replace(`__${key}__`, data[key] || '')
			}
			$('body').append(html)
		},
		editAbled(){
			$(this.el).find('button').removeClass('is-disabled').attr('disabled', false)
		},
		editDisabled(){
			$(this.el).find('button').addClass('is-disabled').attr('disabled', true)
		},
		removeDialog(){
			$('body').find('.edit-playlist-dialog').remove()
		}
	}

	let model = {
		data:{},
		delete(){
			var playlist = AV.Object.createWithoutData('Playlist', this.data.id);
			return playlist.destroy().then((success) => {
			   return success
			});
		},
		save(){
		    var todo = AV.Object.createWithoutData('Playlist', this.data.id);
		    todo.set('name', this.data.name);
		    todo.set('cover', this.data.cover);
		    return todo.save().then((result) => {
		    	return result;
		    })
		}
	}

	let controller = {
		init(view, model){
			this.view = view
			this.model = model
			this.bindEventHub()
			this.bindEvents()
		},
		bindEventHub(){
			window.eventHub.on('editAbled', (data) => {
				this.model.data = data
				this.view.editAbled()
			})

			window.eventHub.on('editDisabled', (data) => {
				this.model.data = {}
				this.view.editDisabled()
			})
		},
		bindEvents(){
			$(this.view.el).on('click', '.primary', (e) => {
				this.view.render(this.model.data)
				this.validateForm()
			})

			$(this.view.el).on('click', '.danger', (e) => {
				this.model.delete().then((success) => {
					window.eventHub.emit('deletePlaylist', this.model.data)
				})
			})

			$('body').on('click', '#savePlaylist', (e) => {
				let isValidate = Boolean($('body').find('.validate-tips').text())
				if(!isValidate){ // 验证是否通过
					let valueList = ['name', 'cover']
					valueList.map((key) => {
						this.model.data[key] = $('.edit-playlist-dialog').find(`input[name=${key}]`).val()
					})
					this.model.save().then((result) => {
						window.eventHub.emit('updatePlaylist', this.model.data)
						this.view.removeDialog()
					})
				}
			})

			$('body').on('click', '#canclePlaylist', (e) => {
				this.view.removeDialog()
			})
		},
		validateForm(){
			$('body').find('#playlistName').on('blur', (e) => {
				let value = $(e.currentTarget).val()
				if(!value){
					$(e.currentTarget).parent().siblings('.validate-tips').text('请输入歌单名')
				}else{
					$(e.currentTarget).parent().siblings('.validate-tips').text('')
				}
			})

			$('body').find('#playlistCover').on('blur', (e) => {
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