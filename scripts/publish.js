#!/usr/bin/env node

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = new URL('.', import.meta.url).pathname

// Função para executar comandos
function execCommand(command, options = {}) {
	try {
		console.log(`🔄 Executando: ${command}`)
		const result = execSync(command, { 
			stdio: 'inherit', 
			encoding: 'utf8',
			...options 
		})
		console.log(`✅ Comando executado com sucesso: ${command}`)
		return result
	} catch (error) {
		console.error(`❌ Erro ao executar comando: ${command}`)
		console.error(error.message)
		process.exit(1)
	}
}

// Função para ler o package.json
function readPackageJson() {
	const packagePath = join(__dirname, '..', 'package.json')
	return JSON.parse(readFileSync(packagePath, 'utf8'))
}

// Função para escrever o package.json
function writePackageJson(packageJson) {
	const packagePath = join(__dirname, '..', 'package.json')
	writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n')
}

// Função para obter o tipo de versão do argumento
function getVersionType() {
	const args = process.argv.slice(2)
	const versionType = args[0]
	
	if (!versionType) {
		console.log('📝 Uso: node scripts/publish.js [patch|minor|major]')
		console.log('   patch: 1.0.1 -> 1.0.2 (correções de bugs)')
		console.log('   minor: 1.0.1 -> 1.1.0 (novas funcionalidades)')
		console.log('   major: 1.0.1 -> 2.0.0 (mudanças que quebram compatibilidade)')
		process.exit(1)
	}
	
	if (!['patch', 'minor', 'major'].includes(versionType)) {
		console.error('❌ Tipo de versão inválido. Use: patch, minor ou major')
		process.exit(1)
	}
	
	return versionType
}

// Função para verificar se há mudanças não commitadas
function checkUncommittedChanges() {
	try {
		const status = execSync('git status --porcelain', { encoding: 'utf8' })
		if (status.trim()) {
			console.error('❌ Existem mudanças não commitadas. Faça commit antes de publicar.')
			console.error('Mudanças detectadas:')
			console.error(status)
			process.exit(1)
		}
	} catch (error) {
		console.error('❌ Erro ao verificar status do git')
		process.exit(1)
	}
}

// Função para verificar se está na branch main
function checkBranch() {
	try {
		const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim()
		if (branch !== 'main' && branch !== 'master') {
			console.error(`❌ Você está na branch "${branch}". Publique apenas da branch main/master.`)
			process.exit(1)
		}
	} catch (error) {
		console.error('❌ Erro ao verificar branch atual')
		process.exit(1)
	}
}

// Função para verificar se está logado no npm
function checkNpmLogin() {
	try {
		execSync('npm whoami', { stdio: 'pipe' })
	} catch (error) {
		console.error('❌ Você não está logado no npm. Execute "npm login" primeiro.')
		process.exit(1)
	}
}

// Função principal
async function main() {
	console.log('🚀 Iniciando processo de publicação...')
	
	// Verificações prévias
	console.log('\n🔍 Fazendo verificações prévias...')
	checkUncommittedChanges()
	checkBranch()
	checkNpmLogin()
	
	// Obter tipo de versão
	const versionType = getVersionType()
	console.log(`\n📦 Tipo de versão: ${versionType}`)
	
	// Ler package.json atual
	const packageJson = readPackageJson()
	const currentVersion = packageJson.version
	console.log(`📋 Versão atual: ${currentVersion}`)
	
	// Atualizar versão
	console.log('\n🔄 Atualizando versão...')
	execCommand(`npm version ${versionType} --no-git-tag-version`)
	
	// Ler nova versão
	const newPackageJson = readPackageJson()
	const newVersion = newPackageJson.version
	console.log(`📋 Nova versão: ${newVersion}`)
	
	// Executar testes
	console.log('\n🧪 Executando testes...')
	execCommand('npm run type-check')
	execCommand('npm run lint:check')
	
	// Build
	console.log('\n🔨 Fazendo build...')
	execCommand('npm run build')
	
	// Commit das mudanças
	console.log('\n💾 Fazendo commit das mudanças...')
	execCommand(`git add .`)
	execCommand(`git commit -m "chore: bump version to ${newVersion}"`)
	
	// Criar tag
	console.log('\n🏷️ Criando tag...')
	execCommand(`git tag v${newVersion}`)
	
	// Push das mudanças e tag
	console.log('\n📤 Fazendo push das mudanças...')
	execCommand('git push origin main')
	execCommand(`git push origin v${newVersion}`)
	
	// Publicar no npm
	console.log('\n📦 Publicando no npm...')
	execCommand('npm publish')
	
	console.log('\n🎉 Publicação concluída com sucesso!')
	console.log(`📦 Versão ${newVersion} publicada no npm`)
	console.log(`🔗 https://www.npmjs.com/package/${packageJson.name}`)
}

// Executar script
main().catch(error => {
	console.error('❌ Erro durante a publicação:', error)
	process.exit(1)
}) 