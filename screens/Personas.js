import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Dimensions, Modal } from "react-native";
import { getAPI, updateAPI } from "../service/ServicePersonas";
import { MaterialIcons } from '@expo/vector-icons';

const Personas = () => {
  const [personas, setPersonas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedPersona, setEditedPersona] = useState(null);
  const [filteredPersonas, setFilteredPersonas] = useState([]);
  const [filters, setFilters] = useState({ showOnlyNO: false, showOnlyNOVerificados: false });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      if (!loading && hasMore) {
        setLoading(true);
        const data = await getAPI(`http://localhost:8080/personas?page=${page}&pageSize=15`);
        if (data.length > 0) {
          setPersonas(prevPersonas => [...prevPersonas, ...data]);
          setFilteredPersonas(prevFilteredPersonas => [...prevFilteredPersonas, ...data]);
          setPage(page + 1);
        } else {
          setHasMore(false); // No hay más datos para cargar
        }
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = useCallback((field, value) => {
    setEditedPersona(prevEditedPersona => ({ ...prevEditedPersona, [field]: value }));
  }, []);

  const handleUpdate = useCallback(async () => {
    try {
      await updateAPI(`http://localhost:8080/personas`, editedPersona);
      const updatedPersonas = personas.map(persona =>
        persona.codigo === editedPersona.codigo ? editedPersona : persona
      );
      setPersonas(updatedPersonas);
      setModalVisible(false);
    } catch (error) {
      console.error('Error al actualizar los datos:', error);
    }
  }, [editedPersona, personas]);

  const openModal = useCallback((index) => {
    setEditedPersona(personas[index]);
    setModalVisible(true);
  }, [personas]);

  const filterDataByRUC = useCallback(() => {
    const filteredData = personas.filter(persona => persona.ruc.includes('NO'));
    setFilteredPersonas(filteredData);
    setFilters(prevFilters => ({ ...prevFilters, showOnlyNO: true }));
  }, [personas]);

  const clearFilterByRUC = useCallback(() => {
    setFilteredPersonas(personas);
    setFilters(prevFilters => ({ ...prevFilters, showOnlyNO: false }));
  }, [personas]);

  const filterDataByVerificados = useCallback(() => {
    const filteredData = personas.filter(persona => persona.verficado.includes('NO'));
    setFilteredPersonas(filteredData);
    setFilters(prevFilters => ({ ...prevFilters, showOnlyNOVerificados: true }));
  }, [personas]);

  const clearFilterByVerificados = useCallback(() => {
    setFilteredPersonas(personas);
    setFilters(prevFilters => ({ ...prevFilters, showOnlyNOVerificados: false }));
  }, [personas]);

  const windowWidth = Dimensions.get('window').width;
  const itemWidth = (windowWidth - 60) / 3;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={filters.showOnlyNO ? clearFilterByRUC : filterDataByRUC} style={styles.filterButton}>
        <Text style={styles.filterButtonText}>{filters.showOnlyNO ? 'Limpiar Filtro RUC' : 'Filtrar por RUC'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={filters.showOnlyNOVerificados ? clearFilterByVerificados : filterDataByVerificados} style={styles.filterButton}>
        <Text style={styles.filterButtonText}>{filters.showOnlyNOVerificados ? 'Limpiar Filtro Verificados' : 'Filtrar por Verificados'}</Text>
      </TouchableOpacity>
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>Identificación</Text>
        <Text style={styles.headerCell}>Apellidos</Text>
        <Text style={styles.headerCell}>Nombres</Text>
        <Text style={styles.headerCell}>RUC</Text>
        <Text style={styles.headerCell}>Código</Text>
        <Text style={styles.headerCell}>Verificado</Text>
        <Text style={styles.headerCell}>Razón Social</Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={filteredPersonas}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => openModal(index)} style={styles.dataRow}>
            <Text style={styles.dataCell}>{item.identificacion}</Text>
            <Text style={styles.dataCell}>{item.lic_apellido}</Text>
            <Text style={styles.dataCell}>{item.lic_nombre}</Text>
            <Text style={styles.dataCell}>{item.ruc}</Text>
            <Text style={styles.dataCell}>{item.codigo}</Text>
            <Text style={styles.dataCell}>{item.verficado}</Text>
            <Text style={styles.dataCell}>{item.razon_social}</Text>
            <TouchableOpacity onPress={() => openModal(index)}>
              <MaterialIcons name="edit" size={24} color="blue" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        onEndReached={() => {
          if (!loading && hasMore) {
            fetchData();
          }
        }}
        onEndReachedThreshold={0.1}
      />
      {editedPersona && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Editar Persona</Text>
              <TextInput
                value={editedPersona.identificacion}
                onChangeText={(value) => handleEdit('identificacion', value)}
                style={styles.input}
              />
              <TextInput
                value={editedPersona.lic_apellido}
                onChangeText={(value) => handleEdit('lic_apellido', value)}
                style={styles.input}
              />
              <TextInput
                value={editedPersona.lic_nombre}
                onChangeText={(value) => handleEdit('lic_nombre', value)}
                style={styles.input}
              />
              <TextInput
                value={editedPersona.ruc}
                onChangeText={(value) => handleEdit('ruc', value)}
                style={styles.input}
              />
              <TextInput
                value={editedPersona.codigo}
                onChangeText={(value) => handleEdit('codigo', value)}
                style={styles.input}
              />
              <TextInput
                value={editedPersona.verficado}
                onChangeText={(value) => handleEdit('verficado', value)}
                style={styles.input}
              />
              <TextInput
                value={editedPersona.razon_social}
                onChangeText={(value) => handleEdit('razon_social', value)}
                style={styles.input}
              />
              <TouchableOpacity onPress={handleUpdate} style={styles.saveButton}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};


//Styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
    paddingBottom: 5,
    marginBottom: 5,
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    paddingBottom: 5,
    marginBottom: 5,
  },
  dataCell: {
    flex: 1,
    textAlign: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold'
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10,
    width: '100%',
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  closeButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  filterButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Personas;
