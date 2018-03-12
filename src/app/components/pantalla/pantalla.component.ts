import { Component, OnInit } from '@angular/core';

import { PantallaService } from '../../services/pantalla/pantalla.service';

import { pantalla } from '../../../config.private';
import * as moment from 'moment';
import { ConfiguracionService } from '../../services/configuracion/configuracionPantalla.service';

@Component({
  selector: 'app-pantalla',
  templateUrl: './pantalla.component.html',
  styleUrls: ['./pantalla.component.css']
})
export class PantallaComponent implements OnInit {
  numero: any = 1;

  turno: any = {
    espacioFisico: null,
    paciente: {
      nombre: null,
      apellido: null
    },
    profesional: {
      nombre: null,
      apellido: null
    },
    tipoPrestacion: null
  };

  paciente: any = {
    nombre: '',
    apellido: ''
  };
  public nombrePantalla;
  private fecha;
  public audio = false;
  public now;
  public ultimosTurnos = [];
  connection;

  ngOnInit() {
    const nombreP = localStorage.getItem('NombrePantalla');


    // this.connection = this.pantallaService.getNumero(pantalla.nombrePantalla).subscribe(turno => {
    //   debugger;
    //   console.log("Numero:  ", turno);
    //   this.paciente.nombre = turno.paciente.nombre;
    //   this.paciente.apellido = turno.paciente.apellido;
    //   // this.numero = numero;
    // });


    const timeoutId = setInterval(() => {
      const time = new Date();
      this.now = ('0' + time.getHours()).substr(-2) + ':' + ('0' + time.getMinutes()).substr(-2) ;
      // this.now = ('0'+time.getHours()).substr(-2) +':'+ ('0'+time.getMinutes()).substr(-2) +':'+ ('0'+time.getSeconds()).substr(-2);

    }, 1000);
    moment.locale('es');
    this.fecha = moment(new Date()).format('LL');
    const datosPantalla = {
      pantalla: nombreP,
      prestaciones: []
    };

    this.configuracionPantallaService.get({nombrePantalla: nombreP}).subscribe(datos => {

    this.traeTurnos()
      if (datos) {
        const prest =  datos[0].prestaciones;
        prest.forEach(element => {
         datosPantalla.prestaciones.push(element.conceptId);
        });
      }

      this.pantallaService.getTurno(datosPantalla).subscribe(turnoEntrante => {
        this.turno.espacioFisico = '';
        if (turnoEntrante) {
          this.audio = true;
          this.turno.paciente.nombre = turnoEntrante.paciente.nombre;
          this.turno.paciente.apellido = turnoEntrante.paciente.apellido;
          this.turno.profesional.nombre = turnoEntrante.profesional.nombre;
          this.turno.profesional.apellido = turnoEntrante.profesional.apellido;
          if (turnoEntrante.espacioFisico) {
            this.turno.espacioFisico = turnoEntrante.espacioFisico.nombre;
          } else {
            this.turno.espacioFisico = 'Consultar';
          }
          var turnoAlista = {
            horaInicio: turnoEntrante.horaInicio,
            horaLlamada: turnoEntrante.horaLlamada,
            profesional: [turnoEntrante.profesional],
            paciente:[turnoEntrante.paciente],
            espacioFisico: this.turno.espacioFisico
          }
          var index = this.ultimosTurnos.findIndex(obj => obj.paciente[0].id === turnoAlista.paciente[0].id);
          console.log(index)
          if (index === -1) {
            this.ultimosTurnos.push(turnoAlista)
            this.ultimosTurnos.splice(0,1);
            console.log(this.ultimosTurnos)
          }

        }
        setTimeout(() => {
          this.audio = false;
      }, 2200);



      // var index = this.ultimosTurnos.findIndex(obj => obj.paciente === element.pantalla);
      // if (index !== -1) {
         
      // }


      });

    });

  }

  constructor(public pantallaService: PantallaService, public configuracionPantallaService: ConfiguracionService) { }
  prueba() {
    this.audio = true;
    setTimeout(() => {
      this.audio = false;
  }, 2200);
  }

  traeTurnos(){
    this.pantallaService.getTotalTurnos({limit: 3}).subscribe(data =>{
      console.log("aca",data)
      this.ultimosTurnos = data;
    })
  }


}
