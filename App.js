import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';

export default function App() {
    const [produtos, setProdutos] = useState([]);
    const [nome, setNome] = useState('');
    const [valor, setValor] = useState('');
    const [editandoId, setEditandoId] = useState(null);

    useEffect(() => {
        fetch('http://172.26.32.135:3000/produtos')
            .then(response => response.json())
            .then(data => setProdutos(data))
            .catch(error => console.error(error));
    }, []);

    const adicionarProduto = () => {
        fetch('http://172.26.32.135:3000/produto', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, valor }),
        })
        .then(response => response.json())
        .then(() => {
            setNome('');
            setValor('');
            fetch('http://172.26.32.135:3000/produtos') 
                .then(response => response.json())
                .then(data => setProdutos(data));
        })
        .catch(error => console.error(error));
    };

    const editarProduto = (id, nomeAtual, valorAtual) => {
        setEditandoId(id);
        setNome(nomeAtual);
        setValor(valorAtual.toString());
    };

    const salvarProduto = () => {
        fetch(`http://192.168.0.5:3000/produto/${editandoId}`, { 
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, valor }),
        })
        .then(response => response.json())
        .then(() => {
            setNome('');
            setValor('');
            setEditandoId(null); 
            fetch('http://172.26.32.135:3000/produtos')
                .then(response => response.json())
                .then(data => setProdutos(data));
        })
        .catch(error => console.error(error));
    };

    const cancelarEdicao = () => {
        setNome('');
        setValor('');
        setEditandoId(null);
    };

    return (
        <View style={{paddingHorizontal: 30, paddingVertical: 60 }} >
            <TextInput
                placeholder="Nome do Produto"
                value={nome}
                onChangeText={setNome}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
                placeholder="Valor"
                value={valor}
                onChangeText={setValor}
                keyboardType="numeric"
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            
            {editandoId ? (
                <>
                    <Button title="Salvar Alterações" onPress={salvarProduto} />
                    <Button title="Cancelar" onPress={cancelarEdicao} />
                </>
            ) : (
                <Button title="Adicionar Produto" onPress={adicionarProduto} />
            )}

            <FlatList
                data={produtos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <Text>{item.nome} - R$ {parseFloat(item.valor).toFixed(2)}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => editarProduto(item.id, item.nome, item.valor)}>
                                <Text style={{ color: 'blue', marginRight: 10 }}>Editar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}